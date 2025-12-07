const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);

module.exports = router;

