var jwt = require('jsonwebtoken');

module.exports = (owner_id) => {
  return jwt.sign({ owner_id: owner_id }, process.env.TOKEN_SECRET, {
    expiresIn: 86400 // 24h
  });
};
