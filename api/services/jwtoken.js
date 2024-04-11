var jwt = require("jsonwebtoken");

module.exports = {
  sign: function (payload) {
    return jwt.sign(
      {
        data: payload,
      },
      process.env.JWT_TOKEN,
      { expiresIn: process.env.LOGIN_TOKEN_EXPIRED }
    );
  },
  verify: function (token, callback) {
    jwt.verify(token, process.env.JWT_TOKEN, callback);
  },
};
