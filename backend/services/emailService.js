const nodemailer = require('nodemailer');

// Create transporter with environment variables
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} resetUrl - Password reset URL
 * @param {string} name - User's name (optional)
 * @param {boolean} isAdmin - Whether this is for admin
 */
async function sendPasswordResetEmail(to, resetUrl, name = 'User', isAdmin = false) {
  const transporter = createTransporter();

  const subject = isAdmin
    ? 'MindSettler Admin - Password Reset Request'
    : 'MindSettler - Password Reset Request';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #6366f1, #ec4899); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">MindSettler</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">${isAdmin ? 'Admin Console' : 'Mental Well-being Platform'}</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">Password Reset Request</h2>
                  <p style="color: #64748b; margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
                    Hi ${name},
                  </p>
                  <p style="color: #64748b; margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
                    We received a request to reset your password. Click the button below to create a new password:
                  </p>
                  
                  <!-- Button -->
                  <table role="presentation" style="margin: 30px 0;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #6366f1, #4f46e5); border-radius: 8px;">
                        <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #94a3b8; margin: 24px 0 0; font-size: 14px; line-height: 1.6;">
                    This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.
                  </p>
                  
                  <p style="color: #94a3b8; margin: 16px 0 0; font-size: 12px; line-height: 1.6;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${resetUrl}" style="color: #6366f1; word-break: break-all;">${resetUrl}</a>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                    © ${new Date().getFullYear()} MindSettler. All rights reserved.
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
    MindSettler - Password Reset Request

    Hi ${name},

    We received a request to reset your password. Click the link below to create a new password:

    ${resetUrl}

    This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.

    © ${new Date().getFullYear()} MindSettler. All rights reserved.
  `;

  try {
    await transporter.sendMail({
      from: `"MindSettler" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

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
  const transporter = createTransporter();

  const subject = 'MindSettler - Your Session is Confirmed! ✓';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Session Confirmed</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 12px;">✓</div>
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Session Confirmed!</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">MindSettler - Mental Well-being Platform</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">Hi ${booking.name || 'there'},</h2>
                  <p style="color: #64748b; margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
                    Great news! Your therapy session has been confirmed. Here are your booking details:
                  </p>
                  
                  <!-- Booking Details Card -->
                  <table role="presentation" style="width: 100%; background-color: #f8fafc; border-radius: 12px; margin: 24px 0;">
                    <tr>
                      <td style="padding: 24px;">
                        <table role="presentation" style="width: 100%;">
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                              <span style="color: #94a3b8; font-size: 14px;">📅 Date</span><br>
                              <span style="color: #1a1a2e; font-size: 16px; font-weight: 600;">${booking.date}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                              <span style="color: #94a3b8; font-size: 14px;">🕐 Time</span><br>
                              <span style="color: #1a1a2e; font-size: 16px; font-weight: 600;">${booking.time}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                              <span style="color: #94a3b8; font-size: 14px;">📍 Mode</span><br>
                              <span style="color: #1a1a2e; font-size: 16px; font-weight: 600;">${booking.mode === 'online' ? 'Online Session' : 'In-Person Session'}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <span style="color: #94a3b8; font-size: 14px;">👤 Session Type</span><br>
                              <span style="color: #1a1a2e; font-size: 16px; font-weight: 600;">${booking.sessionType || 'Individual'}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #64748b; margin: 24px 0; font-size: 16px; line-height: 1.6;">
                    ${booking.mode === 'online'
      ? 'You will receive a meeting link via email before your session starts.'
      : 'Please arrive 10 minutes before your scheduled time.'}
                  </p>
                  
                  <p style="color: #94a3b8; margin: 24px 0 0; font-size: 14px; line-height: 1.6;">
                    If you need to reschedule or cancel, please contact us at least 24 hours in advance.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                    © ${new Date().getFullYear()} MindSettler. All rights reserved.
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
    MindSettler - Session Confirmed!

    Hi ${booking.name || 'there'},

    Great news! Your therapy session has been confirmed.

    Booking Details:
    - Date: ${booking.date}
    - Time: ${booking.time}
    - Mode: ${booking.mode === 'online' ? 'Online Session' : 'In-Person Session'}
    - Session Type: ${booking.sessionType || 'Individual'}

    ${booking.mode === 'online'
      ? 'You will receive a meeting link via email before your session starts.'
      : 'Please arrive 10 minutes before your scheduled time.'}

    If you need to reschedule or cancel, please contact us at least 24 hours in advance.

    © ${new Date().getFullYear()} MindSettler. All rights reserved.
  `;

  try {
    await transporter.sendMail({
      from: `"MindSettler" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

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
  const transporter = createTransporter();

  const subject = 'MindSettler - Session Update';
  const reasonText = reason || 'Unfortunately, the requested time slot is not available. Please try booking a different slot.';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Session Update</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 40px 30px; text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 12px;">📋</div>
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Session Update</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">MindSettler - Mental Well-being Platform</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">Hi ${booking.name || 'there'},</h2>
                  <p style="color: #64748b; margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
                    We regret to inform you that your session request could not be confirmed at this time.
                  </p>
                  
                  <!-- Booking Details Card -->
                  <table role="presentation" style="width: 100%; background-color: #fef2f2; border-radius: 12px; margin: 24px 0; border-left: 4px solid #ef4444;">
                    <tr>
                      <td style="padding: 24px;">
                        <p style="color: #991b1b; font-weight: 600; margin: 0 0 8px; font-size: 14px;">SESSION DETAILS</p>
                        <p style="color: #1a1a2e; margin: 0; font-size: 16px;">
                          <strong>Date:</strong> ${booking.date}<br>
                          <strong>Time:</strong> ${booking.time}<br>
                          <strong>Mode:</strong> ${booking.mode === 'online' ? 'Online Session' : 'In-Person Session'}
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Reason Section -->
                  <table role="presentation" style="width: 100%; background-color: #f8fafc; border-radius: 12px; margin: 24px 0;">
                    <tr>
                      <td style="padding: 24px;">
                        <p style="color: #64748b; font-weight: 600; margin: 0 0 8px; font-size: 14px;">REASON FROM OUR TEAM</p>
                        <p style="color: #1a1a2e; margin: 0; font-size: 16px; line-height: 1.6;">
                          ${reasonText}
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #64748b; margin: 24px 0; font-size: 16px; line-height: 1.6;">
                    We apologize for any inconvenience. Please feel free to book another available slot that works for you.
                  </p>
                  
                  <p style="color: #94a3b8; margin: 24px 0 0; font-size: 14px; line-height: 1.6;">
                    If you have any questions, please don't hesitate to contact us.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                    © ${new Date().getFullYear()} MindSettler. All rights reserved.
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
    MindSettler - Session Update

    Hi ${booking.name || 'there'},

    We regret to inform you that your session request could not be confirmed at this time.

    Session Details:
    - Date: ${booking.date}
    - Time: ${booking.time}
    - Mode: ${booking.mode === 'online' ? 'Online Session' : 'In-Person Session'}

    Reason: ${reasonText}

    We apologize for any inconvenience. Please feel free to book another available slot.

    © ${new Date().getFullYear()} MindSettler. All rights reserved.
  `;

  try {
    await transporter.sendMail({
      from: `"MindSettler" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`Booking rejection email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send booking rejection email:', error);
    throw error;
  }
}

module.exports = {
  sendPasswordResetEmail,
  sendBookingConfirmationEmail,
  sendBookingRejectionEmail,
};
