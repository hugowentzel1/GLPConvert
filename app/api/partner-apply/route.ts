import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting
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
    const { company, name, email, phone, experience, message } = body;
    
    // Validate required fields
    if (!company || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    
    // Prepare email content
    const emailSubject = `New Partner Application – ${company}`;
    const emailBody = `
New Partner Application Received

Company: ${company}
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Solar Companies: ${experience || 'Not specified'}

Message:
${message || 'No message provided'}

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
            from: `no-reply@${process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '') || 'sunspire-web-app.vercel.app'}`,
            to: ['support@getsunspire.com'],
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
        
        const transporter = nodemailer.createTransporter({
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
          to: 'support@getsunspire.com',
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
        experience,
        message,
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
