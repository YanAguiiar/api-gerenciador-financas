const express = require('express');
const AuthController = require('./auth-controller');

const router = express.Router();

// Rota de login
router.post('/login', AuthController.login);

// Rota de Registro
router.post('/register', AuthController.register);

module.exports = router;
