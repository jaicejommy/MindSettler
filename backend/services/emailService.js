const Brevo = require('@getbrevo/brevo');

// Initialize Brevo
const apiInstance = new Brevo.TransactionalEmailsApi();
if (process.env.BREVO_API_KEY) {
  apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
} else {
  console.warn('WARNING: BREVO_API_KEY is missing in environment variables.');
}

// Helper for 'from' address
// IMPORTANT: This must match a verified "Sender" in Brevo
const getFromAddress = () => process.env.EMAIL_FROM || 'mindsettler@example.com';
const getWebsiteUrl = () => process.env.CLIENT_URL || 'https://mindsettler.com';

// Common Styles
const styles = {
  body: "margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;",
  container: "width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08);",
  header: "background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); padding: 60px 40px; text-align: center;",
  headerTitle: "color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.02em; text-shadow: 0 2px 4px rgba(0,0,0,0.1);",
  headerSubtitle: "color: rgba(255,255,255,0.95); margin: 12px 0 0; font-size: 16px; font-weight: 500;",
  content: "padding: 40px;",
  heading: "color: #1f2937; margin: 0 0 20px; font-size: 24px; font-weight: 700; letter-spacing: -0.01em;",
  text: "color: #4b5563; margin: 0 0 24px; font-size: 16px; line-height: 1.7;",
  buttonTable: "margin: 32px 0;",
  buttonLink: "display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; text-decoration: none; padding: 18px 48px; border-radius: 50px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.3s ease;",
  secondaryButtonLink: "display: inline-block; background-color: #f3f4f6; color: #4b5563; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 14px; margin-top: 16px; transition: background-color 0.2s;",
  footer: "background-color: #f9fafb; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;",
  footerText: "color: #9ca3af; margin: 0 0 8px; font-size: 13px;",
  card: "background-color: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 24px;"
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} resetUrl - Password reset URL
 * @param {string} name - User's name (optional)
 * @param {boolean} isAdmin - Whether this is for admin
 */
async function sendPasswordResetEmail(to, resetUrl, name = 'User', isAdmin = false) {
  const subject = isAdmin
    ? 'MindSettler Admin - Password Reset Request'
    : 'MindSettler - Reset Your Password';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&display=swap" rel="stylesheet">
    </head>
    <body style="${styles.body}">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center">
            <div style="${styles.container}">
              <!-- Header -->
              <div style="${styles.header}">
                <h1 style="${styles.headerTitle}">MindSettler</h1>
                <p style="${styles.headerSubtitle}">${isAdmin ? 'Admin Security' : 'Account Recovery'}</p>
              </div>
              
              <!-- Content -->
              <div style="${styles.content}">
                <h2 style="${styles.heading}">Reset Password Request</h2>
                <p style="${styles.text}">Hi ${name},</p>
                <p style="${styles.text}">We received a request to reset your password. No worries, we can help you get back in.</p>
                
                <div style="text-align: center; ${styles.buttonTable}">
                  <a href="${resetUrl}" style="${styles.buttonLink}">Reset My Password</a>
                </div>
                
                <p style="${styles.text} font-size: 14px; color: #6b7280;">
                  This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
                  <p style="font-size: 12px; color: #9ca3af; word-break: break-all; margin-bottom: 5px;">Button not working? Copy this link:</p>
                  <a href="${resetUrl}" style="font-size: 12px; color: #6366f1;">${resetUrl}</a>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="${styles.footer}">
                <p style="${styles.footerText}">© ${new Date().getFullYear()} MindSettler. All rights reserved.</p>
                <a href="${getWebsiteUrl()}" style="${styles.secondaryButtonLink}">Visit Website</a>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = { name: "MindSettler", email: getFromAddress() };
    sendSmtpEmail.to = [{ email: to, name: name }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`Password reset email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}

/**
 * Send booking confirmation email
 * @param {string} to - Recipient email
 * @param {object} booking - Booking details
 */
async function sendBookingConfirmationEmail(to, booking) {
  const subject = 'Session Confirmed! 🎉';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Session Confirmed</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&display=swap" rel="stylesheet">
    </head>
    <body style="${styles.body}">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center">
            <div style="${styles.container}">
              <div style="${styles.header} background: linear-gradient(135deg, #059669 0%, #10b981 100%);">
                <div style="font-size: 48px; margin-bottom: 10px;">✨</div>
                <h1 style="${styles.headerTitle}">You're All Set!</h1>
                <p style="${styles.headerSubtitle}">Your session has been successfully confirmed.</p>
              </div>
              
              <div style="${styles.content}">
                <p style="${styles.text}">Hi ${booking.name || 'there'},</p>
                <p style="${styles.text}">We're looking forward to seeing you. Here are the details for your upcoming session:</p>
                
                <div style="${styles.card}">
                  <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 12px;">
                    <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600;">Date & Time</span>
                    <span style="font-size: 18px; font-weight: 700; color: #0f172a;">${booking.date} at ${booking.time}</span>
                  </div>
                  <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 12px;">
                    <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600;">Mode</span>
                    <span style="font-size: 16px; font-weight: 600; color: #0f172a;">${booking.mode === 'online' ? '🎥 Online Session' : '🏢 In-Person Session'}</span>
                  </div>
                  <div>
                    <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600;">Session Type</span>
                    <span style="font-size: 16px; font-weight: 600; color: #0f172a;">${booking.sessionType || 'Individual Therapy'}</span>
                  </div>
                </div>

                <div style="text-align: center; ${styles.buttonTable}">
                  <a href="${getWebsiteUrl()}/dashboard" style="${styles.buttonLink}">View My Bookings</a>
                </div>

                 <p style="${styles.text} font-size: 14px; text-align: center;">
                    Needed to reschedule? You can do so from your dashboard at least 24h in advance.
                </p>
              </div>
              
               <div style="${styles.footer}">
                <p style="${styles.footerText}">© ${new Date().getFullYear()} MindSettler. All rights reserved.</p>
                <a href="${getWebsiteUrl()}" style="${styles.secondaryButtonLink}">Visit Website</a>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = { name: "MindSettler", email: getFromAddress() };
    sendSmtpEmail.to = [{ email: to, name: booking.name || 'User' }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`Booking confirmation email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    throw error;
  }
}

/**
 * Send booking rejection email
 * @param {string} to - Recipient email
 * @param {object} booking - Booking details
 * @param {string} reason - Rejection reason from admin
 */
async function sendBookingRejectionEmail(to, booking, reason) {
  const subject = 'Update Regarding Your Session';
  const reasonText = reason || 'Unfortunately, the requested time slot is no longer available.';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Session Update</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&display=swap" rel="stylesheet">
    </head>
    <body style="${styles.body}">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center">
            <div style="${styles.container}">
              <div style="${styles.header} background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                 <div style="font-size: 48px; margin-bottom: 10px;">📅</div>
                <h1 style="${styles.headerTitle}">Session Update</h1>
                <p style="${styles.headerSubtitle}">We couldn't confirm your request.</p>
              </div>
              
              <div style="${styles.content}">
                <p style="${styles.text}">Hi ${booking.name || 'there'},</p>
                <p style="${styles.text}">We regret to inform you that we couldn't proceed with your specific booking request:</p>
                
                 <div style="${styles.card} border-left: 4px solid #ef4444;">
                   <strong style="color: #991b1b;">${booking.date} at ${booking.time}</strong>
                </div>

                <div style="background-color: #fff1f2; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                  <strong style="color: #9f1239; display: block; margin-bottom: 5px; font-size: 13px; text-transform: uppercase;">Message from Team</strong>
                  <p style="margin: 0; color: #881337;">${reasonText}</p>
                </div>

                <p style="${styles.text}">Please don't be discouraged! We have other slots available that might work for you.</p>

                <div style="text-align: center; ${styles.buttonTable}">
                  <a href="${getWebsiteUrl()}/book" style="${styles.buttonLink}">Book Another Slot</a>
                </div>
              </div>
              
               <div style="${styles.footer}">
                <p style="${styles.footerText}">© ${new Date().getFullYear()} MindSettler. All rights reserved.</p>
                <a href="${getWebsiteUrl()}" style="${styles.secondaryButtonLink}">Visit Website</a>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = { name: "MindSettler", email: getFromAddress() };
    sendSmtpEmail.to = [{ email: to, name: booking.name || 'User' }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`Booking rejection email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send booking rejection email:', error);
    throw error;
  }
}

/**
 * Send welcome email to new users after signup
 * @param {string} to - Recipient email
 * @param {string} name - User's name
 */
async function sendWelcomeEmail(to, name = 'there') {
  const subject = 'Welcome to MindSettler 🌿';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to MindSettler</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&display=swap" rel="stylesheet">
    </head>
    <body style="${styles.body}">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center">
            <div style="${styles.container}">
              <div style="${styles.header} background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);">
                <div style="font-size: 56px; margin-bottom: 10px;">🌿</div>
                <h1 style="${styles.headerTitle}">Welcome Home.</h1>
                <p style="${styles.headerSubtitle}">Your journey to mental wellness starts here.</p>
              </div>
              
              <div style="${styles.content}">
                <p style="${styles.text}">Hi ${name},</p>
                <p style="${styles.text}">
                  Thank you for joining <strong>MindSettler</strong>. We've created this space for you to slow down, reflect, and prioritize your well-being without any pressure.
                </p>
                
                <div style="background-color: #f5f3ff; border-radius: 16px; padding: 30px; margin: 30px 0;">
                  <h3 style="color: #5b21b6; margin-top: 0;">What you can do here:</h3>
                  <ul style="padding-left: 20px; color: #4c1d95; margin-bottom: 0;">
                    <li style="margin-bottom: 10px;">🗓️ Book professional therapy sessions</li>
                    <li style="margin-bottom: 10px;">🧘 Explore wellness resources</li>
                    <li style="margin-bottom: 0;">💬 Connect with our support team</li>
                  </ul>
                </div>

                <div style="text-align: center; ${styles.buttonTable}">
                  <a href="${getWebsiteUrl()}" style="${styles.buttonLink}">Explore MindSettler</a>
                </div>
              </div>
              
               <div style="${styles.footer}">
                <p style="${styles.footerText}">© ${new Date().getFullYear()} MindSettler. All rights reserved.</p>
                <div style="margin-top: 20px;">
                  <a href="${getWebsiteUrl()}" style="${styles.secondaryButtonLink}">Visit Website</a>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = { name: "MindSettler", email: getFromAddress() };
    sendSmtpEmail.to = [{ email: to, name: name }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`Welcome email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

module.exports = {
  sendPasswordResetEmail,
  sendBookingConfirmationEmail,
  sendBookingRejectionEmail,
  sendWelcomeEmail,
};
