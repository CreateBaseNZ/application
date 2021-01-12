/* ==========================================================
MODULES
========================================================== */

const nodemailer = require("nodemailer");

/* ==========================================================
VARIABLES
========================================================== */

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let email = {
  send: undefined
};

/* ==========================================================
FUNCTIONS
========================================================== */

email.send = async () => {
  const transporterOptions = {
    host: process.env.AWS_SMTP_HOST,
    port: process.env.AWS_SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.AWS_SMTP_USERNAME,
      pass: process.env.AWS_SMTP_PASSWORD
    }
  };
  const transporter = nodemailer.createTransport(transporterOptions);
  const message = {
    from: `"CreateBase" <${process.env.EMAIL_ADDRESS}>`,
    to: `carlvelasco96@gmail.com`,
    subject: "test SMTP",
    text: "test Text",
    html: "<div>Test HTML</div>"
  };
  console.log(message);
  try {
    await transporter.sendMail(message);
  } catch (error) {
    return console.log("failed test");
  }
  return console.log("succeeded test");
};

/* ==========================================================
EXPORT
========================================================== */

module.exports = email;

/* ==========================================================
END
========================================================== */