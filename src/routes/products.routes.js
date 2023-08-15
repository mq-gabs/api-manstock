const { Router } = require('express');
const ProductsController = require('../controllers/ProductsController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const productsRoutes = Router();
const productsController = new ProductsController();

productsRoutes.use(ensureAuthenticated);

productsRoutes.get('/', productsController.getAll);
productsRoutes.get('/:id', productsController.getOne);
productsRoutes.post('/', productsController.create);
productsRoutes.patch('/:id', productsController.update);
productsRoutes.delete('/:id', productsController.delete);

module.exports = productsRoutes;