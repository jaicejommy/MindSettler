const nodemailer = require('nodemailer');

// Create transporter with environment variables
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

/**
 * Send reschedule proposal email
 */
async function sendRescheduleEmail(to, booking, newDate, newTime, message) {
    const transporter = createTransporter();
    const subject = 'MindSettler - Session Reschedule Proposal';
    const adminMessage = message || 'We need to reschedule your session due to unforeseen circumstances.';
    const userName = booking.name || 'there';
    const oldDate = booking.date;
    const oldTime = booking.time;
    const year = new Date().getFullYear();

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Reschedule</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 40px 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 12px;">📅</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Reschedule Request</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">MindSettler - Mental Well-being Platform</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1a1a2e; margin: 0 0 16px; font-size: 22px;">Hi ${userName},</h2>
              <p style="color: #64748b; margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
                We need to propose a new time for your upcoming session.
              </p>
              <table role="presentation" style="width: 100%; background-color: #fef3c7; border-radius: 12px; margin: 24px 0; border-left: 4px solid #f59e0b;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="color: #92400e; font-weight: 600; margin: 0 0 8px; font-size: 14px;">ORIGINAL BOOKING</p>
                    <p style="color: #1a1a2e; margin: 0; font-size: 16px; text-decoration: line-through;">${oldDate} at ${oldTime}</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" style="width: 100%; background-color: #ecfdf5; border-radius: 12px; margin: 24px 0; border-left: 4px solid #10b981;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="color: #065f46; font-weight: 600; margin: 0 0 8px; font-size: 14px;">PROPOSED NEW TIME</p>
                    <p style="color: #1a1a2e; margin: 0; font-size: 20px; font-weight: 600;">${newDate} at ${newTime}</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" style="width: 100%; background-color: #f8fafc; border-radius: 12px; margin: 24px 0;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="color: #64748b; font-weight: 600; margin: 0 0 8px; font-size: 14px;">MESSAGE FROM OUR TEAM</p>
                    <p style="color: #1a1a2e; margin: 0; font-size: 16px; line-height: 1.6;">${adminMessage}</p>
                  </td>
                </tr>
              </table>
              <p style="color: #64748b; margin: 24px 0; font-size: 16px; line-height: 1.6;">
                If this new time works for you, no action is needed - we'll see you then! 
                If you need to choose a different time, please reply to this email or book a new slot on our website.
              </p>
              <p style="color: #94a3b8; margin: 24px 0 0; font-size: 14px; line-height: 1.6;">
                We apologize for any inconvenience and thank you for your understanding.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; margin: 0; font-size: 12px;">© ${year} MindSettler. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = `MindSettler - Session Reschedule Proposal

Hi ${userName},

We need to propose a new time for your upcoming session.

Original Booking: ${oldDate} at ${oldTime}
Proposed New Time: ${newDate} at ${newTime}

Message from our team:
${adminMessage}

If this new time works for you, no action is needed - we'll see you then!
If you need to choose a different time, please reply to this email or book a new slot on our website.

We apologize for any inconvenience and thank you for your understanding.

© ${year} MindSettler. All rights reserved.`;

    try {
        await transporter.sendMail({
            from: `"MindSettler" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        });
        console.log(`Reschedule email sent to ${to}`);
        return true;
    } catch (error) {
        console.error('Failed to send reschedule email:', error);
        throw error;
    }
}

module.exports = { sendRescheduleEmail };
