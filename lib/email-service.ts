/**
 * Email Service for GLPConvert (Wellspire LLC)
 * Sends transactional emails after purchase
 * Uses Resend API with SMTP fallback
 */

import { signMagicLinkToken } from '@/src/server/auth/jwt';
import { ENV } from '@/src/config/env';
import { PRODUCT_NAME, SUPPORT_EMAIL } from '@/lib/product-identity';

// Retry helper for email sending
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, i)));
      }
    }
  }
  throw lastError || new Error('Retry failed');
}

interface OnboardingEmailParams {
  toEmail: string;
  company: string;
  instantUrl: string;
  customDomain: string;
  embedCode: string;
  apiKey: string;
  dashboardUrl: string;
  magicLinkUrl: string;
}

export async function sendOnboardingEmail(params: OnboardingEmailParams) {
  const {
    toEmail,
    company,
    instantUrl,
    customDomain,
    embedCode,
    apiKey,
    dashboardUrl,
    magicLinkUrl,
  } = params;

  const appBase = (ENV.NEXT_PUBLIC_APP_URL || 'https://glpconvert.com').replace(/\/$/, '');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${company} ${PRODUCT_NAME} funnel is ready!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                🎉 Your ${PRODUCT_NAME} funnel is live!
              </h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">
                Your ${company} branded intake experience is ready
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Hi there,
              </p>

              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Your payment has been processed successfully. Your branded intake and booking flow is live and ready to capture qualified leads.
              </p>

              <!-- Option 1: Instant URL -->
              <div style="background-color: #f9fafb; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #10b981; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                  📍 Instant URL (Use Immediately)
                </h2>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                  Share this link on social media, email campaigns, or anywhere else:
                </p>
                <div style="background-color: #ffffff; padding: 12px; border-radius: 4px; border: 1px solid #e5e7eb;">
                  <code style="color: #667eea; font-size: 14px; word-break: break-all;">
                    ${instantUrl}
                  </code>
                </div>
              </div>

              <!-- Option 2: Embed Code -->
              <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #3b82f6; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                  💻 Embed on Your Website
                </h2>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                  Paste this code on any page of your website:
                </p>
                <div style="background-color: #1f2937; padding: 12px; border-radius: 4px; overflow-x: auto;">
                  <code style="color: #10b981; font-size: 12px; font-family: 'Courier New', monospace; display: block; white-space: pre;">
${embedCode}</code>
                </div>
              </div>

              <!-- Option 3: Custom Domain -->
              <div style="background-color: #f9fafb; border-left: 4px solid #8b5cf6; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #8b5cf6; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                  🌐 Custom Domain (Optional)
                </h2>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                  Set up your professional domain:
                </p>
                <div style="background-color: #ffffff; padding: 12px; border-radius: 4px; border: 1px solid #e5e7eb;">
                  <code style="color: #8b5cf6; font-size: 14px;">
                    ${customDomain}
                  </code>
                </div>
                <p style="color: #6b7280; font-size: 13px; margin: 10px 0 0 0;">
                  <a href="${dashboardUrl}" style="color: #8b5cf6; text-decoration: none;">View setup instructions →</a>
                </p>
              </div>

              <!-- Dashboard Access -->
              <div style="background-color: #eff6ff; border: 2px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 8px; text-align: center;">
                <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px; font-weight: 700;">
                  🔐 Access Your Dashboard
                </h2>
                <p style="color: #1e40af; font-size: 14px; margin: 0 0 20px 0;">
                  View your URLs, embed codes, and leads anytime:
                </p>
                <a href="${magicLinkUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Access Dashboard →
                </a>
                <p style="color: #6b7280; font-size: 12px; margin: 15px 0 0 0;">
                  This secure link logs you in automatically
                </p>
              </div>

              <!-- API Key (for advanced users) -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                  🔑 API Key (Advanced)
                </h3>
                <p style="color: #78350f; font-size: 12px; margin: 0 0 8px 0; font-family: monospace;">
                  ${apiKey.substring(0, 20)}...
                </p>
                <p style="color: #92400e; font-size: 12px; margin: 0;">
                  View full key in your dashboard
                </p>
              </div>

              <!-- Next Steps -->
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <h3 style="color: #111827; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                  📋 Your first 10 minutes
                </h3>
                <ol style="color: #4b5563; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>
                    <strong>Configure your funnel</strong> in
                    <a href="${appBase}/c/${company}/settings" style="color: #3b82f6; text-decoration: none;">Settings</a>
                    — logo URL, brand color, scheduling link, lead-notification email, and your CRM webhook URL.
                  </li>
                  <li><strong>Drop the URL above</strong> into a cold email, an ad, your CRM workflow, or your existing site.</li>
                  <li><strong>(Optional)</strong> Point a subdomain like <code>book.${company}.com</code> at us — see <a href="${appBase}/docs/embed" style="color: #3b82f6; text-decoration: none;">embed guide</a>.</li>
                  <li><strong>Each new lead is delivered three ways automatically:</strong> your dashboard, your notification inbox, and your CRM webhook.</li>
                </ol>
              </div>

              <!-- Support -->
              <div style="margin-top: 30px; text-align: center; padding: 20px; background-color: #f9fafb; border-radius: 6px;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  Questions? Reply to this email or visit our 
                  <a href="${appBase}/support" style="color: #3b82f6; text-decoration: none;">support page</a>
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 13px; margin: 0 0 10px 0;">
                ${PRODUCT_NAME} — a product of Wellspire LLC
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                <a href="${appBase}/privacy" style="color: #9ca3af; text-decoration: none;">Privacy</a> •
                <a href="${appBase}/terms" style="color: #9ca3af; text-decoration: none;">Terms</a> •
                <a href="${appBase}/support" style="color: #9ca3af; text-decoration: none;">Support</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
🎉 Your ${company} ${PRODUCT_NAME} funnel is ready!

Your payment has been processed. Your branded intake flow is now live!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 INSTANT URL (Use Immediately):
${instantUrl}

Share on social media, email campaigns, ads!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💻 EMBED ON YOUR WEBSITE:

${embedCode}

Paste on any page of your website!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 CUSTOM DOMAIN (Optional):
${customDomain}

Setup instructions: ${dashboardUrl}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 ACCESS YOUR DASHBOARD:
${magicLinkUrl}

View URLs, embed codes, and leads anytime!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 API Key: ${apiKey.substring(0, 20)}...
(Full key available in dashboard)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 YOUR FIRST 10 MINUTES:
1. Configure your funnel: ${appBase}/c/${company}/settings
   (logo, brand color, scheduling link, notification email, CRM webhook)
2. Drop the URL above into a cold email, ad, or CRM workflow.
3. (Optional) Point a subdomain: book.${company}.com
4. Each new lead lands in 3 places: dashboard + notification email + CRM webhook.

Questions? Reply to this email.

Best,
The ${PRODUCT_NAME} team
${appBase}/support
(${SUPPORT_EMAIL})
  `;

  let delivered = false;
  let messageId: string | undefined;

  // Try Resend first (production recommended)
  if (ENV.RESEND_API_KEY) {
    try {
      const fromDomain = ENV.NEXT_PUBLIC_APP_URL?.replace('https://', '').replace('http://', '') || 'glpconvert.com';
      const fromEmail = `no-reply@${fromDomain}`;

      const resendResponse = await retryWithBackoff(async () => {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ENV.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            subject: `🎉 Your ${company} ${PRODUCT_NAME} funnel is ready!`,
            html,
            text,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Resend API error: ${response.status} - ${errorText}`);
        }

        return response.json();
      });

      delivered = true;
      messageId = resendResponse.id;
      console.log('✅ Onboarding email sent via Resend:', messageId);
    } catch (error) {
      console.error('❌ Resend failed:', error);
    }
  }

  // Fallback to SMTP if Resend failed or not configured
  if (!delivered && ENV.SMTP_HOST && ENV.SMTP_USER && ENV.SMTP_PASS) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: ENV.SMTP_HOST,
        port: parseInt(ENV.SMTP_PORT || '587'),
        secure: ENV.SMTP_PORT === '465',
        auth: {
          user: ENV.SMTP_USER,
          pass: ENV.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: ENV.SMTP_FROM || `"${PRODUCT_NAME}" <${ENV.SMTP_USER}>`,
        to: toEmail,
        subject: `🎉 Your ${company} ${PRODUCT_NAME} funnel is ready!`,
        text,
        html,
      });

      delivered = true;
      messageId = info.messageId;
      console.log('✅ Onboarding email sent via SMTP:', messageId);
    } catch (error) {
      console.error('❌ SMTP failed:', error);
    }
  }

  if (!delivered) {
    console.warn('⚠️ No email service configured - onboarding email not sent');
    return { success: false, error: 'No email service configured' };
  }

  return { success: true, messageId };
}

// Generate magic link for passwordless dashboard access (JWT-signed, 7-day expiration)
export function generateMagicLink(email: string, company: string): string {
  const baseUrl = ENV.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const token = signMagicLinkToken(email, company);
  return `${baseUrl}/c/${company}?token=${token}`;
}

// Re-export verify function for convenience
export { verifyMagicLinkToken as verifyMagicLink } from '@/src/server/auth/jwt';



