const AppError = require("../utils/AppError");
const knex = require('../database/knex');
const ProductsController = require("./ProductsController");
const SelfRequester = require("../utils/SelfRequester");

class PurchasesController {
  async create(request, response) {
    const { id: user_id } = request.user;
    const {
      total,
      payment,
      change,
      payment_type_id,
      products,
    } = request.body;

    if (!total || !payment || !change || !payment_type_id) {
      throw new AppError('Entries can not be empty!');
    }

    const payment_type = await knex('payment_types').where({ id: payment_type_id }).first();

    if (!payment_type) {
      throw new AppError('Payment type does not exists!');
    }

    const checkProducts = await Promise.all(
      products.map(async product => {
        const checkProduct = await knex('products').where({ id: product.id }).first();
        return !!checkProduct;
      })
    );

    if (!checkProducts.every(check => check)) {
      throw new AppError('Some product(s) does not exists!');
    }

    const newPurchase = {
      total,
      payment,
      change,
      payment_type_id,
      owner: user_id,
    };

    const [{ id: purchase_id }] = await knex('purchases').insert(newPurchase, 'id');

    if (!purchase_id) {
      throw new AppError('Could not create purchase!', 500);
    }

    const checks = await Promise.all(
      products.map(async product => await knex('purchases_products').insert({
        purchase_id,
        product_id: product.id,
        quantity: product.quantity,
      }))
    );

    if (!checks.every(check => check)) {
      throw new AppError('Could not create purchase X products relation', 500);
    }

    response.json({ message: 'Purchase created successfully!' });
  };
  
  async getAll(request, response) {
    const {
      productName,
      productCode,
      purchaseId,
      page: _page,
      pageSize: _pageSize,
      initDate,
      endDate,
      initTime,
      endTime,
    } = request.query;
    const { id: user_id, profile } = request.user;
    const page = Number(_page);
    const pageSize = Number(_pageSize);

    let purchases = await knex('purchases')
    .orderBy('created_at', 'DESC')
    .modify(qb => {
      if (purchaseId) {
        qb.where({ id: purchaseId });
        return;
      }

      if (profile !== 'admin') {
        qb.where({ owner: user_id });
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
    
    if (productCode || productName) {
      const productsController = new ProductsController();
      let checkPurchases = await Promise.all(
      purchases.map(async purchase => {
        const req = new SelfRequester(productsController.getByPurchaseId, { 
          params: { id: purchase.id },
        });
        let products = await req.run();

        if (productName) {
          products = products.filter(product => product.name.toLowerCase().includes(productName.toLowerCase()));
        }

        if (productCode) {
          products = products.filter(product => productCode.includes(product.code));
        }
        
        if (products.length === 0) {
          return false;
        }
        return purchase.id;
      })
      );
      checkPurchases = checkPurchases.filter(check => check !== false);
      
      purchases = purchases.filter(purchase => checkPurchases.includes(purchase.id));
    }

    const count = purchases.length;

    const initPos = (page * pageSize) || 0;
    const endPos = ((page + 1) * pageSize) || 10;

    response.json([purchases.slice(initPos, endPos), count]);
  };
  
  async getOne(request, response) {
    const { id } = request.params;

    const purchase = await knex('purchases').where({ id }).first();

    if (!purchase) {
      throw new AppError('There is not purchase with this id!');
    }

    const productsController = new ProductsController();
    const req = new SelfRequester(productsController.getByPurchaseId, {
      params: { id }
    });
    const products = await req.run();

    response.json({ ...purchase, products });
  };
}

module.exports = PurchasesController;