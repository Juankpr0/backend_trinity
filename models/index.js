const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.Product = require('./products.model')(sequelize, DataTypes);
db.Category = require('./category.model')(sequelize, DataTypes);
db.Movement = require('./movement.model')(sequelize, DataTypes);
db.User = require('./user.model')(sequelize, DataTypes);
db.Salida = require('./salidas.model')(sequelize, DataTypes); 
db.Notification = require('./notification.model')(sequelize, DataTypes);


// Relaciones
db.Category.hasMany(db.Product, { foreignKey: 'category_id' });
db.Product.belongsTo(db.Category, { foreignKey: 'category_id' });

db.Product.hasMany(db.Movement, { foreignKey: 'product_id' });
db.Movement.belongsTo(db.Product, { foreignKey: 'product_id' });

db.Product.hasMany(db.Salida, { foreignKey: 'productoId' }); // ✅ Relación producto-salida
db.Salida.belongsTo(db.Product, { foreignKey: 'productoId', as: 'producto' }); // ✅ Relación inversa

// Sincronizar la base de datos 
db.sequelize.sync({ alter: true })
  .then(() => console.log('Modelos sincronizados con la base de datos'))
  .catch((err) => console.error('Error al sincronizar modelos:', err));

module.exports = db;
