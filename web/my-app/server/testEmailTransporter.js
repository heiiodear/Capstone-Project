require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Step 1: Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Transporter verification failed:", error);
  } else {
    console.log("✅ Transporter is ready to send email");

   // Step 2: Send test email
    transporter.sendMail({
      from: `"Secura" <${process.env.EMAIL_SENDER}>`,
      to: "julia12a2005@gmail.com", // ✅ <- PUT YOUR REAL EMAIL HERE
      subject: "🚨 Test Email from Secura",
      text: "This is a test email sent via Nodemailer.",
      html: `<p><strong>🚨 Test Email</strong><br>This email was sent from your server successfully.</p>`
    })
    .then(info => {
      console.log("✅ Email sent:", info.response);
    })
    .catch(err => {
      console.error("❌ Failed to send test email:", err);
    });
  }
});