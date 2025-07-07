// routes/salidas.routes.js
const express = require('express');
const router = express.Router();
const db = require('../models');

// Registrar salida y actualizar productos.vendidos
router.post('/', async (req, res) => {
  try {
    const { productoId, cantidad, fecha, hora, nota, responsable } = req.body;

    // Validaciones básicas
    if (!productoId || !cantidad) {
      return res.status(400).json({ mensaje: 'Producto y cantidad son obligatorios' });
    }

    // Verificar si el producto existe
    const producto = await db.Product.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Crear la salida
    const salida = await db.Salida.create({
      productoId,
      cantidad,
      fecha,
      hora,
      nota,
      responsable
    });

    // Actualizar contador de productos vendidos
    await producto.increment('vendidos', { by: cantidad });

    res.status(201).json({ mensaje: 'Salida registrada y producto actualizado', salida });
  } catch (error) {
    console.error('❌ Error al registrar salida:', error);
    res.status(500).json({ mensaje: 'Error al registrar salida' });
  }
});

// Obtener todas las salidas
router.get('/', async (req, res) => {
  try {
    const salidas = await db.Salida.findAll({
      include: [{ model: db.Product, as: 'producto', attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });

    const formateadas = salidas.map(s => ({
      id: s.id,
      producto: s.producto?.name,
      cantidad: s.cantidad,
      fecha: s.fecha,
      hora: s.hora,
      nota: s.nota,
      responsable: s.responsable
    }));

    res.json(formateadas);
  } catch (error) {
    console.error('❌ Error al obtener salidas:', error);
    res.status(500).json({ mensaje: 'Error al obtener salidas' });
  }
});

module.exports = router;
