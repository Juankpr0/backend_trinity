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
db.Product = require('./product.model')(sequelize, DataTypes);
db.Category = require('./category.model')(sequelize, DataTypes);
db.Movement = require('./movement.model')(sequelize, DataTypes);
db.User = require('./user.model')(sequelize, DataTypes); // ✅ Agregado

// Relaciones
db.Category.hasMany(db.Product, { foreignKey: 'category_id' });
db.Product.belongsTo(db.Category, { foreignKey: 'category_id' });

db.Product.hasMany(db.Movement, { foreignKey: 'product_id' });
db.Movement.belongsTo(db.Product, { foreignKey: 'product_id' });

module.exports = db;
