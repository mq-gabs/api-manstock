const { Router } = require('express');
const sessionsRoutes = require('./sessions.routes');
const usersRoutes = require('./users.routes');
const productsRoutes = require('./products.routes');
const paymentTypesRoutes = require('./payment-types.routes');
const purchasesRoutes = require('./purchases.routes');

const router = Router();

router.use('/auth', sessionsRoutes);
router.use('/users', usersRoutes);
router.use('/products', productsRoutes);
router.use('/payment-types', paymentTypesRoutes);
router.use('/purchases', purchasesRoutes);

module.exports = router;