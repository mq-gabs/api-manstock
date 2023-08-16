const AppError = require("../utils/AppError");
const knex = require('../database/knex');

const tb = 'payment_types';

class PaymentTypesController {
  async create(request, response) {
    const { name } = request.body;

    if (!name) {
      throw new AppError('Entries can not be empty!');
    }

    const paymentType = await knex(tb).where({ name }).first();

    if (paymentType) {
      throw new AppError('There is already a payment type with this name');
    }

    const check = await knex('payment_types').insert({ name });

    if (!check) {
      throw new AppError('Could not create payment type');
    }

    response.json({ message: 'Payment type created successfully!' });
  };
  
  async getAll(request, response) {
    const paymentTypes = await knex(tb).limit(10);

    response.json(paymentTypes);
  };

  async getOne(request, response) {
    const { id } = request.params;

    const paymentType = await knex(tb).where({ id }).first();

    if (!paymentType) {
      throw new AppError('There is no payment type with this id');
    }

    response.json(paymentType);
  };

  async update(request, response) {
    const { id } = request.params;
    const { name } = request.body;

    if (!name) {
      throw new AppError('Entries can not be empty!');
    }

    const paymentType = await knex(tb).where({ id }).first();

    if (!paymentType) {
      throw new AppError('There is no payment type with this id!');
    }

    const updatedPaymentType = {
      ...paymentType,
      name: name || paymentType.name,
      updated_at: knex.fn.now(),
    };

    const check = await knex(tb).where({ id }).update(updatedPaymentType);

    if (!check) {
      throw new AppError('Could not update payment type!');
    }

    response.json({ message: 'Payment type updated successfully!' });
  };

  async delete(request, response) {
    const { id } = request.params;

    const paymentType = await knex(tb).where({ id }).first();

    if (!paymentType) {
      throw new AppError('There is no payment type with this id!');
    }

    const check = await knex(tb).where({ id }).del();

    if (!check) {
      throw new AppError('Could not delete payment type');
    }
    
    response.json({ message: 'Payment type deleted successfully!' });
  };
}

module.exports = PaymentTypesController;