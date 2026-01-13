const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendPortfolioMail = async ({ name, email, subject, message }) => {
  await transporter.sendMail({
  from: `"Portfolio" <${process.env.MAIL_USER}>`,
  to: process.env.ADMIN_MAIL,
  subject: "New Portfolio Message",
  html: `
    <h3>New Message</h3>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p>${message}</p>
  `,
});
};


module.exports = { sendPortfolioMail };
