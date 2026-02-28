// backend/src/models/User.model.js

const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@helpdesk.com",
    password: "admin123", // EN PRODUCCIÓN USAR HASH!
    role: "admin",
    department: "IT"
  },
  {
    id: 2,
    name: "Técnico IT",
    email: "tecnico@helpdesk.com",
    password: "tecnico123",
    role: "tecnico",
    department: "IT"
  },
  {
    id: 3,
    name: "Empleado Regular",
    email: "empleado@empresa.com",
    password: "empleado123",
    role: "empleado",
    department: "Ventas"
  }
];

// Función para encontrar usuario por email
const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

// Función para validar contraseña (temporal - sin hash)
const validatePassword = (user, password) => {
  return user.password === password;
};

module.exports = {
  users,
  findUserByEmail,
  validatePassword
};