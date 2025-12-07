const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

exports.sign = (payload, options = {}) => {
  return jwt.sign(payload, SECRET, Object.assign({ expiresIn: '1h' }, options));
};

exports.verify = (token) => {
  return jwt.verify(token, SECRET);
};
