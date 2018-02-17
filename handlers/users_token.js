const jwt = require('jsonwebtoken');

const generateToken = user => jwt.sign({
  userId: user.id,
  roleId: user.roleId,
  name: user.name,
  lastName: user.lastName,
}, process.env.JWTSECRET, { algorithm: process.env.JWTALGORITHM, expiresIn: '60m' });

module.exports = generateToken;
