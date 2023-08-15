const { verify } = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const authConfig = require('../configs/auth');

const ensureAdmin = (request, response, next) => {
  const { profile } = request.user;

  if (profile !== 'admin') {
    throw new AppError('This action needs admin privileges!', 401);
  }

  return next();
}

module.exports = ensureAdmin;