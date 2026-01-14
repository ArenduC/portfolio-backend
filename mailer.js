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
  <div style="
    background-color:#0b0b0b;
    padding:40px 20px;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  ">
    <div style="
      max-width:600px;
      margin:0 auto;
      background:linear-gradient(180deg, #141414, #0f0f0f);
      border-radius:16px;
      padding:30px;
      box-shadow:0 20px 50px rgba(0,0,0,0.6);
      border:1px solid rgba(255,215,0,0.15);
    ">
      
      <!-- Header -->
      <h2 style="
        margin:0 0 10px;
        color:#ffffff;
        text-align:center;
        font-size:26px;
        letter-spacing:0.5px;
      ">
        Get In Touch
      </h2>

      <p style="
        text-align:center;
        color:#9b9b9b;
        font-size:14px;
        margin-bottom:30px;
      ">
        New message received from your portfolio
      </p>

      <!-- Divider -->
      <div style="
        height:2px;
        width:60px;
        background:#f5d000;
        margin:0 auto 25px;
        border-radius:2px;
      "></div>

      <!-- Content -->
      <table width="100%" cellpadding="0" cellspacing="0" style="color:#eaeaea;">
        <tr>
          <td style="padding:8px 0; font-size:14px;">
            <strong style="color:#f5d000;">Name</strong><br/>
            ${name}
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0; font-size:14px;">
            <strong style="color:#f5d000;">Email</strong><br/>
            <a href="mailto:${email}" style="color:#ffffff; text-decoration:none;">
              ${email}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0; font-size:14px;">
            <strong style="color:#f5d000;">Subject</strong><br/>
            ${subject}
          </td>
        </tr>
      </table>

      <!-- Message Box -->
      <div style="
        margin-top:20px;
        background:#1a1a1a;
        border-radius:12px;
        padding:20px;
        border:1px solid rgba(255,215,0,0.12);
        color:#e0e0e0;
        font-size:14px;
        line-height:1.6;
      ">
        ${message.replace(/\n/g, "<br/>")}
      </div>

      <!-- Footer -->
      <div style="
        margin-top:30px;
        text-align:center;
        font-size:12px;
        color:#777;
      ">
        © ${new Date().getFullYear()} Arendu Chanda  
        <br/>
        Portfolio Contact Form
      </div>

    </div>
  </div>
`

  
});
};


module.exports = { sendPortfolioMail };
