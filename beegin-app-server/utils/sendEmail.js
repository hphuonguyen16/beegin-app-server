const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: `
<!DOCTYPE html>
<html>
<head>
    <title>Email Verification</title>
</head>
<body>
    <h1>Email Verification</h1>
    <p>Dear User,</p>
    <p>Thank you for signing up. To verify your email, please click the following link:</p>
    <p><a href="${text}">Verify Email</a></p>
    <p>If you did not request this verification, you can ignore this email.</p>
    <p>Best regards,</p>
    <p>Beegin App</p>
</body>
</html>
`,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};
