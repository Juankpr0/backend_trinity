module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '⚠️ El nombre de la categoría no puede estar vacío.'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        esRutaValida(value) {
          if (value && !/^https?:\/\/.+|^\/.+/.test(value)) {
            throw new Error('⚠️ La URL de la imagen debe ser absoluta (https://...) o una ruta relativa válida (ej. /img/imagen.png)');
          }
        }
      }
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: '⚠️ El stock mínimo no puede ser negativo.'
        }
      }
    }
  }, {
    tableName: 'Categories',
    timestamps: true
  });

  // Relaciones
  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: 'category_id',
      as: 'productos',
      onDelete: 'CASCADE',
      hooks: true
    });
  };

  return Category;
};
