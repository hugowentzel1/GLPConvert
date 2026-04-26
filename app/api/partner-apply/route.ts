import { NextRequest, NextResponse } from "next/server";
import { SUPPORT_EMAIL } from "@/lib/product-identity";

const FROM_HOST_FALLBACK = "glp-convert.vercel.app";
function fromAddress(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "");
  return `no-reply@${appUrl || FROM_HOST_FALLBACK}`;
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 10;
  
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req);
  
  // Rate limiting
  if (!checkRateLimit(clientIP)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }
  
  try {
    const body = await req.json();
    /**
     * The Partners form posts a single `note` field that already concatenates
     * Phone + Client Range + free-text message (see `app/partners/page.tsx`).
     * `experience` is accepted only for backwards compatibility with older
     * test fixtures; new submissions use `note`.
     */
    const { company, name, email, phone, experience, note, message } = body;

    if (!company || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const emailSubject = `New Partner Application – ${company}`;
    const detail = note ?? message ?? "No additional details provided";
    const emailBody = `
New Partner Application Received

Company: ${company}
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Notes (client range / message):
${detail}
${experience ? `\nLegacy "experience" field: ${experience}` : ''}

---
Submitted at: ${new Date().toISOString()}
Environment: ${process.env.NODE_ENV || 'development'}
IP: ${clientIP}
    `.trim();
    
    let delivered = false;
    
    // Try Resend first
    if (process.env.RESEND_API_KEY) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress(),
            to: [SUPPORT_EMAIL],
            replyTo: email,
            subject: emailSubject,
            text: emailBody,
          }),
        });
        
        if (resendResponse.ok) {
          delivered = true;
          console.log('✅ Partner application sent via Resend');
        } else {
          console.error('❌ Resend failed:', await resendResponse.text());
        }
      } catch (error) {
        console.error('❌ Resend error:', error);
      }
    }
    
    // Try SMTP if Resend failed
    if (!delivered && process.env.SMTP_HOST) {
      try {
        const nodemailer = require('nodemailer');
        
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: SUPPORT_EMAIL,
          replyTo: email,
          subject: emailSubject,
          text: emailBody,
        });
        
        delivered = true;
        console.log('✅ Partner application sent via SMTP');
      } catch (error) {
        console.error('❌ SMTP error:', error);
      }
    }
    
    // Log if no email service is configured
    if (!delivered) {
      console.warn('⚠️ No email service configured - partner application logged only');
      console.log('Partner Application:', {
        company,
        name,
        email,
        phone,
        note: detail,
        experience,
        timestamp: new Date().toISOString(),
        ip: clientIP,
      });
    }
    
    return NextResponse.json({ 
      ok: true, 
      delivered,
      message: delivered 
        ? 'Application submitted successfully' 
        : 'Application received - we\'ll follow up via email'
    });
    
  } catch (error) {
    console.error('Partner application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
