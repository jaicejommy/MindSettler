const Brevo = require('@getbrevo/brevo');

// Initialize Brevo
const apiInstance = new Brevo.TransactionalEmailsApi();
if (process.env.BREVO_API_KEY) {
  apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
}

// Helper for 'from' address
const getFromAddress = () => process.env.EMAIL_FROM || 'mindsettler@example.com';
const getWebsiteUrl = () => process.env.CLIENT_URL || 'https://mindsettler.com';

// Common Styles (matching emailService.js)
const styles = {
  body: "margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;",
  container: "width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08);",
  header: "background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 60px 40px; text-align: center;",
  headerTitle: "color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.02em; text-shadow: 0 2px 4px rgba(0,0,0,0.1);",
  headerSubtitle: "color: rgba(255,255,255,0.95); margin: 12px 0 0; font-size: 16px; font-weight: 500;",
  content: "padding: 40px;",
  heading: "color: #1f2937; margin: 0 0 20px; font-size: 24px; font-weight: 700; letter-spacing: -0.01em;",
  text: "color: #4b5563; margin: 0 0 24px; font-size: 16px; line-height: 1.7;",
  buttonTable: "margin: 32px 0;",
  buttonLink: "display: inline-block; background: linear-gradient(135deg, #ea580c, #c2410c); color: #ffffff; text-decoration: none; padding: 18px 48px; border-radius: 50px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3); text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.3s ease;",
  secondaryButtonLink: "display: inline-block; background-color: #f3f4f6; color: #4b5563; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 14px; margin-top: 16px; transition: background-color 0.2s;",
  footer: "background-color: #f9fafb; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;",
  footerText: "color: #9ca3af; margin: 0 0 8px; font-size: 13px;",
  card: "background-color: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 24px;"
};

/**
 * Send reschedule proposal email
 */
async function sendRescheduleEmail(to, booking, newDate, newTime, message) {
  const subject = 'MindSettler - Reschedule Proposal';
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
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;800&display=swap" rel="stylesheet">
</head>
<body style="${styles.body}">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center">
        <div style="${styles.container}">
          <div style="${styles.header}">
            <div style="font-size: 48px; margin-bottom: 10px;">🕒</div>
            <h1 style="${styles.headerTitle}">Time Change</h1>
            <p style="${styles.headerSubtitle}">Proposing a new time for your session.</p>
          </div>
          
          <div style="${styles.content}">
            <p style="${styles.text}">Hi ${userName},</p>
            <p style="${styles.text}">We need to propose a new time for your upcoming session.</p>
            
            <div style="${styles.card} border-left: 4px solid #f59e0b;">
               <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px dashed #cbd5e1;">
                  <span style="display: block; font-size: 12px; text-transform: uppercase; color: #94a3b8; font-weight: 600; margin-bottom: 4px;">Original Time</span>
                  <span style="font-size: 16px; color: #64748b; text-decoration: line-through;">${oldDate} at ${oldTime}</span>
               </div>
               <div>
                  <span style="display: block; font-size: 12px; text-transform: uppercase; color: #059669; font-weight: 600; margin-bottom: 4px;">Proposed New Time</span>
                  <span style="font-size: 20px; color: #0f172a; font-weight: 700;">${newDate} at ${newTime}</span>
               </div>
            </div>

            <div style="background-color: #fffbeb; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
              <strong style="color: #92400e; display: block; margin-bottom: 5px; font-size: 13px; text-transform: uppercase;">Note from Team</strong>
              <p style="margin: 0; color: #b45309;">${adminMessage}</p>
            </div>

            <p style="${styles.text}">
              If this new time works for you, <strong>no action is needed</strong> - we'll see you then! 
            </p>
            <p style="${styles.text}">
              If you need to choose a different time, please book a new slot.
            </p>

            <div style="text-align: center; ${styles.buttonTable}">
               <a href="${getWebsiteUrl()}/book" style="${styles.buttonLink}">Book Different Time</a>
            </div>
          </div>
          
          <div style="${styles.footer}">
             <p style="${styles.footerText}">© ${year} MindSettler. All rights reserved.</p>
             <a href="${getWebsiteUrl()}" style="${styles.secondaryButtonLink}">Visit Website</a>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `MindSettler - Reschedule Proposal
Hi ${userName},

We need to propose a new time for your upcoming session.

Original Booking: ${oldDate} at ${oldTime}
Proposed New Time: ${newDate} at ${newTime}

Message from our team: ${adminMessage}

If this new time works for you, no action is needed. 
If you need to choose a different time, please visit our website: ${getWebsiteUrl()}/book

© ${year} MindSettler`;

  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.textContent = text;
    sendSmtpEmail.sender = { name: "MindSettler", email: getFromAddress() };
    sendSmtpEmail.to = [{ email: to, name: userName }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Reschedule email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send reschedule email:', error);
    throw error;
  }
}

module.exports = { sendRescheduleEmail };
