const express = require('express');
const router = express.Router();
const db = require('../models');

// POST /api/notifications - Registrar una nueva notificación
router.post('/', async (req, res) => {
  try {
    const { mensaje, tipo } = req.body;

    if (!mensaje) {
      return res.status(400).json({ mensaje: 'El mensaje es obligatorio' });
    }

    const noti = await db.Notification.create({
      mensaje,
      tipo: tipo || 'info' // tipo por defecto
    });

    res.status(201).json(noti);
  } catch (error) {
    console.error('Error creando notificación:', error);
    res.status(500).json({ mensaje: 'Error creando notificación' });
  }
});

// GET /api/notifications - Listar notificaciones
router.get('/', async (req, res) => {
  try {
    const notis = await db.Notification.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(notis);
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({ mensaje: 'Error obteniendo notificaciones' });
  }
});

module.exports = router;
