const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');

router.get('/', UserController.index);

router.post('/', UserController.regist);

router.get('/login', UserController.loginForm);

router.post('/login', UserController.login);


module.exports = router;