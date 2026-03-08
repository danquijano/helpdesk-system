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
    name: "IT Technician",
    email: "technician@helpdesk.com",
    password: "technician123",
    role: "technician",
    department: "IT"
  },
  {
    id: 3,
    name: "Regular Employee",
    email: "employee@company.com",
    password: "employee123",
    role: "employee",
    department: "Sales"
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