// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Ruta de login (pública)
router.post('/login', login);

// Ruta de perfil (protegida)
router.get('/profile', authMiddleware, getProfile);

module.exports = router;