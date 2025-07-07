// models/Salida.js
module.exports = (sequelize, DataTypes) => {
  const Salida = sequelize.define('Salida', {
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hora: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nota: {
      type: DataTypes.STRING,
      allowNull: true
    },
    responsable: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  Salida.associate = (models) => {
    Salida.belongsTo(models.Product, { foreignKey: 'productoId', as: 'producto' });
  };

  return Salida;
};
