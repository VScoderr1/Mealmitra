const nodemailer = require("nodemailer");

// Sends an email if SMTP credentials are configured in .env.
// If not configured, it safely logs to console instead of crashing the app,
// so the project runs end-to-end even without a real email account.
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("\n[EMAIL - MOCK MODE] (configure EMAIL_USER/EMAIL_PASS in .env to send real emails)");
    console.log(`To: ${to}\nSubject: ${subject}\n${html}\n`);
    return { mocked: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    return { mocked: false };
  } catch (err) {
    console.error("Email send failed:", err.message);
    return { mocked: true, error: err.message };
  }
};

module.exports = sendEmail;
