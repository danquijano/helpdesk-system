// backend/src/controllers/auth.controller.js
const { findUserByEmail, validatePassword } = require('../models/User.model');

const login = (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar que enviaron email y password
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email y contraseña son requeridos" 
      });
    }
    
    // Buscar usuario
    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ 
        error: "Credenciales inválidas" 
      });
    }
    
    // Validar contraseña
    const isValid = validatePassword(user, password);
    
    if (!isValid) {
      return res.status(401).json({ 
        error: "Credenciales inválidas" 
      });
    }
    
    // En versión real: generar JWT token
    const token = "token-simulado-" + Date.now();
    
    // No enviar password al frontend
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: "Login exitoso",
      token,
      user: userWithoutPassword
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: "Error en el servidor" 
    });
  }
};

const getProfile = (req, res) => {
  // req.user vendría del middleware
  res.json({
    user: req.user
  });
};

module.exports = {
  login,
  getProfile
};