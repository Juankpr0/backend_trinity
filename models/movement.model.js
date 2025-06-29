module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Movement', {
    product_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    date: DataTypes.DATE,
    note: DataTypes.STRING,
    responsible: DataTypes.STRING
  });
};