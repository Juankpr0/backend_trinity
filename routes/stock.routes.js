const express = require('express');
const router = express.Router();
const db = require('../models');

// 🔹 Resumen general por categoría
router.get('/resumen', async (req, res) => {
  try {
    const resumen = await db.Category.findAll({
      include: [
        {
          model: db.Product,
          attributes: ['quantity', 'updatedAt']
        }
      ]
    });

    const respuesta = resumen.map(cat => {
      const cantidades = cat.Products.map(p => p.quantity);
      const total = cantidades.reduce((a, b) => a + b, 0);
      const ultimaActualizacion = cat.Products
        .map(p => p.updatedAt)
        .sort((a, b) => b - a)[0];

      return {
        id: cat.id,
        categoria: cat.name,
        alias: cat.name,
        total,
        disponible: total,
        minimo: 30,
        ultima_actualizacion: ultimaActualizacion?.toISOString().split('T')[0] || 'Sin datos'
      };
    });

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el resumen de stock' });
  }
});

// 🔹 Resumen por categoría (sólo nombre y total)
router.get('/resumen/categoria', async (req, res) => {
  try {
    const resumen = await db.Category.findAll({
      include: [{ model: db.Product, attributes: ['quantity'] }]
    });

    const respuesta = resumen.map(cat => ({
      categoria: cat.name,
      total: cat.Products.reduce((sum, p) => sum + p.quantity, 0)
    }));

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener resumen por categoría' });
  }
});

router.get('/productos', async (req, res) => {
  try {
    const productos = await db.Product.findAll({
      include: [{ model: db.Category, attributes: ['name'] }]
    });

    const respuesta = productos.map(prod => ({
      id: prod.id,
      name: prod.name,
      quantity: prod.quantity,
      categoria: prod.Category?.name || 'Sin categoría'
    }));

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
});

router.get('/resumen/producto', async (req, res) => {
  try {
    const productos = await db.Product.findAll({
      attributes: ['id', 'name', 'quantity'],
      include: [{ model: db.Category, attributes: ['name'] }]
    });

    const respuesta = productos.map(prod => ({
      id: prod.id,
      producto: prod.name,
      categoria: prod.Category?.name || 'Sin categoría',
      cantidad: prod.quantity
    }));

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener resumen por producto' });
  }
});

// 🔹 Obtener productos por categoría ID
router.get('/productos/categoria/:id', async (req, res) => {
  const categoriaId = req.params.id;

  try {
    const productos = await db.Product.findAll({
      where: { category_id: categoriaId },
      include: [{ model: db.Category, attributes: ['name'] }]
    });

    const respuesta = productos.map(prod => ({
      id: prod.id,
      name: prod.name,
      quantity: prod.quantity,
      categoria: prod.Category?.name || 'Sin categoría'
    }));

    res.json(respuesta);
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos por categoría' });
  }
});

module.exports = router;