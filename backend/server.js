const express = require('express');
const cors = require('cors');
const ticketRoutes = require('./src/routes/ticket.routes');
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./src/routes/auth.routes');

// Ruta auth
app.use('/api/auth', authRoutes);  // Esto crea /api/auth/login

// Ruta ticket
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Login test: http://localhost:${PORT}/api/auth/login`);
});