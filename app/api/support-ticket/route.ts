import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 20;
  
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
    const { subject, email, message, priority } = body;
    
    // Validate required fields
    if (!subject || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    
    // Prepare email content
    const priorityLabel = priority === 'high' ? '🔴 HIGH PRIORITY' : priority === 'critical' ? '🚨 CRITICAL' : '🟢 Normal';
    const emailSubject = `[Support] ${subject} (${priority || 'normal'})`;
    const emailBody = `
New Support Ticket Received

Priority: ${priorityLabel}
From: ${email}
Subject: ${subject}

Message:
${message}

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
            replyTo: email,
            subject: emailSubject,
            text: emailBody,
          }),
        });
        
        if (resendResponse.ok) {
          delivered = true;
          console.log('✅ Support ticket sent via Resend');
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
          to: 'support@getsunspire.com',
          replyTo: email,
          subject: emailSubject,
          text: emailBody,
        });
        
        delivered = true;
        console.log('✅ Support ticket sent via SMTP');
      } catch (error) {
        console.error('❌ SMTP error:', error);
      }
    }
    
    // Log if no email service is configured
    if (!delivered) {
      console.warn('⚠️ No email service configured - support ticket logged only');
      console.log('Support Ticket:', {
        subject,
        email,
        message,
        priority,
        timestamp: new Date().toISOString(),
        ip: clientIP,
      });
    }
    
    return NextResponse.json({ 
      ok: true, 
      delivered,
      message: delivered 
        ? 'Support ticket submitted successfully' 
        : 'Ticket received - we\'ll follow up via email'
    });
    
  } catch (error) {
    console.error('Support ticket error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

