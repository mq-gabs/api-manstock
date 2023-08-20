const AppError = require("../utils/AppError");
const authConfig = require('../configs/auth');
const { sign } = require('jsonwebtoken');
const { compare } = require('bcryptjs');
const knex = require('../database/knex');

class SessionsController {
  async create (request, response) {
    const { email, password } = request.body;

    const user = await knex('users').where({ email }).first();

    if (!user) {
      throw new AppError('Email or password incorrect!', 401);
    }
    
    const userProfile = await knex('profiles').where({ id: user.profile_id }).first();


    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      throw new AppError('Email or password incorrect!', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({ 
      userProfile: userProfile.name,
    }, secret, {
      subject: user.id,
      expiresIn,
    });

    response.json({ user, token });
  } 
}

module.exports = SessionsController;