const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const { hash, compare } = require('bcryptjs');

class UsersController {
  async create(request, response) {
    const {
      name,
      email,
      password,
      userProfile,
    } = request.body;

    const profile = await knex('profiles').where({ name: userProfile || 'default' }).first();

    if (!profile) {
      throw new AppError('There is no profile with this name!');
    }

    const user = await knex('users').where({ email }).first();
 

    if (user) {
      throw new AppError('There is already an user using this email!', 401);
    }

    if (!name || !email || !password) {
      throw new AppError('Entries can not be empty!', 400);
    }

    const encryptedPassword = await hash(password, 8);

    const check = await knex('users').insert({
      name,
      password: encryptedPassword,
      email,
      profile_id: profile.id,
    });

    if (!check) {
      throw new AppError('Could not create user!', 500);
    }

    response.status(201).json({ message: 'User created successfully!' });
  };

  async getAll(request, response) {
    const users = await knex('users');

    const newUsers = await Promise.all(
      users.map(async user => {
        const profile = await knex('profiles').where({ id: user.profile_id }).first();
        return {
          ...user,
          profile: profile.name
        }
      })
    )

    const formatedUsers = newUsers.map(({ id, name, email, created_at, updated_at, profile }) => ({
      id,
      name,
      email,
      created_at,
      updated_at,
      profile,
    }));

    response.json(formatedUsers);
  }

  async getOne(request, response) {
    const { id } = request.params;

    const user = await knex('users').where({ id }).first();

    if (!user) {
      throw new AppError('User does not exists!', 404);
    }

    const formatedUser = {
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    response.json(formatedUser);
  }

  async update(request, response) {
    const { id } = request.params;
    const { 
      name,
      email,
      oldPassword,
      newPassword,
      profileName,
    } = request.body;
    const { id: user_token_id, profile } = request.user;

    if (!name && !email && !oldPassword && !newPassword && !profileName) {
      throw new AppError('No updated entry was sent!', 400);
    }

    if (id !== user_token_id && profile !== 'admin') {
      throw new AppError('The current logged user can not update this user!', 401);
    }

    const { id: newProfileId } = await knex('profiles').where({ name: profileName }).first();

    if (!newProfileId) {
      throw new AppError('There is no profile with this name!');
    }

    const user = await knex('users').where({ id }).first();

    if (!user) {
      throw new AppError('User does not exists!', 400);
    }

    if (newPassword && !oldPassword) {
      throw new AppError('Curret password not informed!');
    }

    let encryptedPassword;
    if (newPassword && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);

      if (!checkOldPassword) {
        throw new AppError('Incorrect current passowrd!');
      }

      encryptedPassword = await hash(newPassword, 8);
    }

    const updatedUser = {
      name: name || user.name,
      email: email || user.email,
      password: encryptedPassword || user.password,
      profile_id: newProfileId || user.profile_id,
      updated_at: knex.fn.now(),
    }

    const check = await knex('users').where({ id }).update(updatedUser);

    if (!check) {
      throw new AppError('Could not update user!', 500);
    }

    response.json({
      message: 'User updated successfully!',
    });
  }
  
  async delete(request, response) {
    const { id } = request.params;

    const user = await knex('users').where({ id }).first();

    if (!user) {
      throw new AppError('User does not exists already!', 404);
    }

    const check = await knex('users').where({ id }).del();

    if (!check) {
      throw new AppError('Could not delete user!', 500);
    }

    response.json({ message: 'User deleted successfully!' });
  }
}

module.exports = UsersController;