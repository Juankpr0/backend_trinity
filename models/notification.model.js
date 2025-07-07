module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    mensaje: {
      type: DataTypes.STRING(255), // Límite de caracteres
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('info', 'success', 'warning', 'error'),
      allowNull: false,
      defaultValue: 'info' // Valor por defecto
    }
  }, {
    timestamps: true // createdAt y updatedAt
  });

  return Notification;
};
