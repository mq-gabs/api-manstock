const { Router } = require('express');
const ProductsController = require('../controllers/ProductsController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const ensureAdmin = require('../middleware/ensureAdmin');

const productsRoutes = Router();
const productsController = new ProductsController();

productsRoutes.use(ensureAuthenticated);

productsRoutes.get('/', productsController.getAll);
productsRoutes.get('/random', ensureAdmin, productsController.getRamdomProduct);
productsRoutes.get('/code/:code', productsController.getProductByCode);
productsRoutes.get('/:id', productsController.getOne);
productsRoutes.post('/', productsController.create);
productsRoutes.patch('/:id', productsController.update);
productsRoutes.delete('/:id', productsController.delete);
productsRoutes.get('/purchase/:id', productsController.getByPurchaseId);

module.exports = productsRoutes;