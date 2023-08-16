const { Router } = require('express');
const PaymentTypesController = require('../controllers/PaymentTypesController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const ensureAdmin = require('../middleware/ensureAdmin');

const paymentTypesRouter = Router();
const paymentTypesController = new PaymentTypesController();

paymentTypesRouter.use(ensureAuthenticated);
paymentTypesRouter.use(ensureAdmin);

paymentTypesRouter.get('/', paymentTypesController.getAll);
paymentTypesRouter.get('/:id', paymentTypesController.getOne);
paymentTypesRouter.post('/', paymentTypesController.create);
paymentTypesRouter.patch('/:id', paymentTypesController.update);
paymentTypesRouter.delete('/:id', paymentTypesController.delete);

module.exports = paymentTypesRouter;