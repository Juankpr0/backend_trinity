const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./models');

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/categories', require('./routes/categories.routes'));
app.use('/api/movements', require('./routes/movements.routes'));
app.use('/api/stock', require('./routes/stock.routes'));

// 🔄 Sincronización y servidor
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('🔄 Tablas sincronizadas correctamente');
    app.listen(3000, () => {
      console.log('🟢 Servidor backend en http://localhost:3000');
    });
  })
  .catch(err => {
    console.error('❌ Error al sincronizar tablas:', err);
  });