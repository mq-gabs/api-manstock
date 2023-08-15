const { Router } = require('express');
const UsersController = require('../controllers/UsersController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const ensureAdmin = require('../middleware/ensureAdmin');

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.use(ensureAuthenticated);

usersRoutes.get('/', ensureAdmin, usersController.getAll);
usersRoutes.get('/:id', ensureAdmin, usersController.getOne);
usersRoutes.post('/', ensureAdmin, usersController.create);
usersRoutes.patch('/:id', usersController.update);
usersRoutes.delete('/:id', ensureAdmin, usersController.delete);

module.exports = usersRoutes;