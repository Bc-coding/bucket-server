const nodemailer = require("nodemailer");
const keys = require("../config/keys");

const user = keys.nodemailerUser;
const pass = keys.nodemailerPass;

let transport = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: user, // generated ethereal user
    pass: pass, // generated ethereal password
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  // console.log("check");

  //console.log("email sent: " + confirmationCode);

  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `
    <h1>Email confirmation</h1>
    <h2>Hello ${name}</h2>
    <p>Thank you for joining bucket list. Please confirm your email by clicking on the following link</p>
    <a href="http://127.0.0.1:5173/confirm/${confirmationCode}">Click here</a>`,
    })
    .catch((err) => console.log(err));
};
