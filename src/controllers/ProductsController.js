const knex = require('../database/knex');
const AppError = require('../utils/AppError');

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

    response.status(201).json({ message: 'Product created successfully!', product: { name, price, code } });
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
    const { id, profile } = request.user;

    const products = await knex('products')
    .whereLike('code', `%${code}%`)
    .andWhereLike('name', `%${name}%`)
    .limit(pageSize || 10)
    .offset((page * pageSize) || 0)
    .orderBy('name', 'asc')
    .modify(qb => {
      if (profile !== 'admin') {
        qb.where({ owner: id });
      }

      if (initDate) {
        qb.where(knex.raw('created_at > ?', initDate));
      }

      if (endDate) {
        qb.where(knex.raw('created_at < ?', endDate));
      }

      if (initTime) {
        qb.where(knex.raw('time(created_at) > ?', initTime));
      }

      if (endTime) {
        qb.where(knex.raw('time(created_at) < ?', endTime));
      }
    });

    const [{ count }] = await knex('products')
    .count('id', { as: 'count' })
    .modify(qb => {
      if (profile !== 'admin') {
        qb.where({ owner: id });
      }
    });

    response.json([products, count]);
  };

  async getOne(request, response) {
    const { id } = request.params;
    const { id: user_id, profile } = request.user;

    const product = await knex('products').where({ id }).first();

    if (!product || (product.owner !== user_id && profile !== 'admin')) {
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

  async getByPurchaseId(request, response) {
    const { id } = request.params;

    const purchasesProducts = await knex('purchases_products').where({ purchase_id: id });

    const products = await Promise.all(
      purchasesProducts.map(async purchase => await knex('products').where({ id: purchase.product_id }).first())
    );
      
    response.json(products);
  }

  async getRamdomProduct(request, response) {
    const { profile } = request.user;
    if (profile !== 'admin') {
      throw new AppError('This action can be made only by admins!');
    }

    const products = await knex('products');

    const product = products[Math.floor(Math.random() * products.length)];
    
    response.json(product);
  }

  async getProductByCode(request, response) {
    const { code } = request.params;
    const { profile, id } = request.user;

    const product = await knex('products').where({ code })
    .modify(qb => {
      if (profile !== 'admin') {
        qb.where({ owner: id });
      }
    }).first();

    if (!product) {
      throw new AppError('There is no product with this code!');
    }

    response.json(product);
  }
}

module.exports = ProductsController;