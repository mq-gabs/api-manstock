const { Router } = require('express');
const PurchasesController = require('../controllers/PurchasesController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const purchasesRouter = Router();
const purchasesController = new PurchasesController();

purchasesRouter.use(ensureAuthenticated);

purchasesRouter.post('/', purchasesController.create);
purchasesRouter.get('/', purchasesController.getAll);
purchasesRouter.get('/:id', purchasesController.getOne);

module.exports = purchasesRouter;