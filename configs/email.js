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

email.send = (object = {}) => {
  return new Promise(async (resolve, reject) => {
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
      to: object.email,
      subject: object.subject,
      text: object.text,
      html: object.html
    };
    try {
      await transporter.sendMail(message);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    return resolve();
  });
};

/* ==========================================================
EXPORT
========================================================== */

module.exports = email;

/* ==========================================================
END
========================================================== */