// prod.js -- production keys here
module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSinganiture: process.env.JWT_SINGANITURE,
  nodemailerSecret: process.env.NODE_MAILER_SECRET,
  nodemailerUser: process.env.NODE_MAILER_USER,
  nodemailerPass: process.env.NODE_MAILER_PASS,
};
