module.exports = (sequelize, DataTypes) => {
  const Movement = sequelize.define('Movement', {
    usuario: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false
  });

  return Movement;
};
