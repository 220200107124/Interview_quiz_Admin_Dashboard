const nodemailer = require("nodemailer");

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "reenatanchak@gmail.com", // your Gmail
    pass: "anar rnaa rouw uwxn",   // your App Password (not Gmail password)
  },
});


const sendMail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: "reenatanchak@gmail.com",
      to,
      subject,
      text,
      ...(html && { html }), // add html only if provided
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error(" Error sending email:", error);
    throw error;
  }
};

module.exports = sendMail;
