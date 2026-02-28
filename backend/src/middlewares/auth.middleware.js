// backend/src/middlewares/auth.middleware.js

const authMiddleware = (req, res, next) => {
  // Silmulacion de un usuario autenticado
  req.user = {
    id: 1,
    email: "admin@helpdesk.com",
    role: "admin"
  };
  next();
};

// Middleware para verificar roles
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "No autorizado" });
    }
    
    next();
  };
};

module.exports = {
  authMiddleware,
  checkRole
};