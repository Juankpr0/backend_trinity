module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: 'category_id'
    });
  };

  return Category;
};
