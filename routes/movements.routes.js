const express = require('express');
const router = express.Router();
const db = require('../models');
const Movement = db.Movement;

router.post('/', async (req, res) => {
  const { usuario, accion } = req.body;
  try {
    const nuevoMovimiento = await Movement.create({ usuario, accion });
    res.status(201).json(nuevoMovimiento);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el movimiento' });
  }
});

router.get('/', async (req, res) => {
  try {
    const movimientos = await Movement.findAll({ order: [['fecha', 'DESC']] });
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los movimientos' });
  }
});

module.exports = router;
