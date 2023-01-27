const JWT = require("jsonwebtoken");
const keys = require("../config/keys");

const getUserFromToken = (token) => {
  const secret = keys.jwtSinganiture;
  try {
    const decoded = JWT.verify(token, secret);
    console.log(decoded);
    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = getUserFromToken;
