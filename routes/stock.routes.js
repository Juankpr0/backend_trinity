const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = db.Sequelize;

// 🔹 Resumen general por categoría
router.get('/resumen', async (req, res) => {
  try {
    const categorias = await db.Category.findAll({
      include: [
        {
          model: db.Product,
          attributes: ['quantity', 'updatedAt']
        }
      ]
    });

    const respuesta = categorias.map(cat => {
      const cantidades = cat.Products.map(p => p.quantity);
      const total = cantidades.reduce((a, b) => a + b, 0);
      const ultimaActualizacionDate = cat.Products
        .map(p => p.updatedAt)
        .filter(d => d != null)
        .sort((a, b) => b.getTime() - a.getTime())[0];

      return {
        id: cat.id,
        categoria: cat.name,
        alias: cat.name,
        total,
        disponible: total,
        minimo: cat.stock_minimo || 30,
        ultima_actualizacion: ultimaActualizacionDate
          ? ultimaActualizacionDate.toISOString().split('T')[0]
          : 'Sin datos'
      };
    });

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el resumen de stock' });
  }
});

// 🔹 Resumen por categoría (solo nombre y total)
router.get('/resumen/categoria', async (req, res) => {
  try {
    const categorias = await db.Category.findAll({
      include: [{ model: db.Product, attributes: ['quantity'] }]
    });

    const respuesta = categorias.map(cat => ({
      categoria: cat.name,
      total: cat.Products.reduce((sum, p) => sum + p.quantity, 0)
    }));

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener resumen por categoría' });
  }
});

// 🔹 Lista productos completos
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

// 🔹 Resumen productos (incluye vendidos)
router.get('/resumen/producto', async (req, res) => {
  try {
    const productos = await db.Product.findAll({
      attributes: ['id', 'name', 'vendidos'],
      include: [{ model: db.Category, attributes: ['name'] }]
    });

    const respuesta = productos.map(prod => ({
      id: prod.id,
      name: prod.name,
      categoria: prod.Category?.name || 'Sin categoría',
      vendidos: prod.vendidos || 0
    }));

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener resumen por producto' });
  }
});

// 🔔 Categorías con stock bajo
router.get('/resumen/stock-bajo', async (req, res) => {
  try {
    const categorias = await db.Category.findAll({
      include: [{ model: db.Product, attributes: ['quantity'] }]
    });

    const respuesta = categorias.map(cat => {
      const total = cat.Products.reduce((sum, p) => sum + p.quantity, 0);
      const estaBajo = total < (cat.stock_minimo || 30);

      return {
        id: cat.id,
        categoria: cat.name,
        stock_total: total,
        stock_minimo: cat.stock_minimo || 30,
        esta_bajo: estaBajo
      };
    });

    res.json(respuesta);
  } catch (error) {
    console.error('❌ Error al verificar stock bajo:', error);
    res.status(500).json({ mensaje: 'Error al obtener stock bajo' });
  }
});

// 🟩 Productos más vendidos (top 10)
router.get('/resumen/productos-mas-vendidos', async (req, res) => {
  try {
    const productos = await db.Product.findAll({
      attributes: ['id', 'name', 'vendidos'],
      include: [{ model: db.Category, attributes: ['name'] }],
      order: [['vendidos', 'DESC']],
      limit: 10
    });

    const respuesta = productos.map(prod => ({
      id: prod.id,
      name: prod.name,
      categoria: prod.Category?.name || 'Sin categoría',
      vendidos: prod.vendidos || 0
    }));

    res.json(respuesta);
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// 🟥 Productos menos vendidos (top 10, vendidos > 0)
router.get('/resumen/productos-menos-vendidos', async (req, res) => {
  try {
    const productos = await db.Product.findAll({
      attributes: ['id', 'name', 'vendidos'],
      include: [{ model: db.Category, attributes: ['name'] }],
      where: { vendidos: { [Op.gt]: 0 } },
      order: [['vendidos', 'ASC']],
      limit: 10
    });

    const respuesta = productos.map(prod => ({
      id: prod.id,
      name: prod.name,
      categoria: prod.Category?.name || 'Sin categoría',
      vendidos: prod.vendidos || 0
    }));

    res.json(respuesta);
  } catch (error) {
    console.error('Error al obtener productos menos vendidos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
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

// 🔹 Total de productos
router.get('/total', async (req, res) => {
  try {
    const total = await db.Product.count();
    res.json(total);
  } catch (error) {
    console.error('Error al obtener total productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener total de productos' });
  }
});

module.exports = router;
