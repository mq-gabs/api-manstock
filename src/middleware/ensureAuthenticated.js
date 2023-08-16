const { verify } = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const authConfig = require('../configs/auth');

const ensureAuthenticated = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token não informado', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const {
      sub: user_id,
      userProfile,
    } = verify(token, authConfig.jwt.secret);

    request.user = { id: user_id, profile: userProfile };

    return next();
  } catch (error) {
    throw new AppError('JWT Token inválido!', 401);
  }
}

module.exports = ensureAuthenticated;