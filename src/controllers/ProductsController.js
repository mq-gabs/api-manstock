const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const validateEntries = require('../utils/validateEntries');

class ProductsController {
  async create(request, response) {
    const {
      name,
      price,
      code,
    } = request.body;
    const { id } = request.user;

    const productWithCode = await knex('products').where({ code, owner: id }).first();

    if (productWithCode) throw new AppError('There is a product with this code yet.', 400);

    const check = await knex('products').insert({
      name,
      price,
      code,
      owner: id,
    });

    if (!check) throw new AppError('Cant save product', 500);

    response.status(201).json({ message: 'Product created successfully!' });
  };

  async getAll(request, response) {
    const {
      name,
      code,
      page,
      pageSize,
      initDate,
      endDate,
      initTime,
      endTime,
    } = request.query;
    const { id } = request.user;

    const initDateTime = `${initDate || ''} ${initTime || ''}`.trim();
    const endDateTime = `${endDate || ''} ${endTime || ''}`.trim();
    
    console.log({ query: request.query, initDateTime, endDateTime });

    const products = await knex('products')
    .where({ owner: id })
    .whereLike('code', `%${code}%`)
    .andWhereLike('name', `%${name}%`)
    .limit(pageSize || 10)
    .offset((page * pageSize) || 0)
    .orderBy('name', 'asc')
    // .where(knex.raw('created_at > ?', initDateTime))
    // .where(knex.raw('created_at < ?', endDateTime));

    // .modify(qb => {
    //   if (initDateTime) {
    //     qb.where(knex.raw('created_at > ?', initDateTime));
    //   }
    //   if (endDateTime) {         
    //     qb.where(knex.raw('created_at < ?', endDateTime));
    //   }
    // })

    response.json(products);
  };

  async getOne(request, response) {
    const { id } = request.params;
    const { id: user_id } = request.user;

    const product = await knex('products').where({ id }).first();
    
    if (!product || product.owner !== user_id) {
      throw new AppError('There is no product with this id', 404);
    } 
    
    response.json(product);
  };

  async update(request, response) {
    const {
      name,
      price,
    } = request.body;
    const { id: product_id } = request.params;
    const { id: user_id } = request.user;

    if (!name && !price) {
      throw new AppError('No updated entry was sent');
    }

    const product = await knex('products').where({ id: product_id }).first();

    if (!product) {
      throw new AppError('Product does not exists!', 404);
    }

    if (product.owner !== user_id) {
      throw new AppError('This product can be only updated by the owner', 401);
    }

    const updatedProduct = {
      ...product,
      name: name || product.name,
      price: price || product.price,
      updated_at: knex.fn.now(),
    };

    const check = await knex('products').where({ id: product_id }).update(updatedProduct);

    if (!check) {
      throw new AppError('Could not update!', 500);
    }

    response.json({ message: 'Product updated successfully!'});
  };

  async delete(request, response) {
    const { id: product_id } = request.params;
    const { id: user_id } = request.user;

    const product = knex('products').where({ id: product_id }).first();

    if (!product) {
      throw new AppError('Product does not exists!', 404);
    }

    if (product.owner !== user_id) {
      throw new AppError('This product can be only deleted by the owner', 401);
    }

    const check = await knex('products').where({ id: product_id }).del();

    if (!check) {
      throw new AppError('Could not delete product!', 500);
    }

    response.json({ message: 'Product deleted successfully!' })
  };
}

module.exports = ProductsController;