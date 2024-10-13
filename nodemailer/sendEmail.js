const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  //   console.log(
  //     "SMTP_SERVICE:",
  //     process.env.SMTP_SERVICE,
  //     "SMTP_MAIL:",
  //     process.env.SMTP_MAIL,
  //     "SMTP_PASSWORD:",
  //     process.env.SMTP_PASSWORD
  //   );
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "muhammadazanafzal878@gmail.com",
      pass: "qsax bbmh xpkc xnmj",
    },
    // tls: {
    //   rejectUnauthorized: true,
    // },
  });
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
