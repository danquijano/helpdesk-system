const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // ¡ESTO ES CRÍTICO!

// Importar rutas
const authRoutes = require('./src/routes/auth.routes');

// Usar rutas - DEBE SER ASÍ:
app.use('/api/auth', authRoutes);  // Esto crea /api/auth/login

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HelpDesk API running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Login test: http://localhost:${PORT}/api/auth/login`);
});