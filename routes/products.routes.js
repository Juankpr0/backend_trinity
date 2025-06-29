const express = require('express');
const router = express.Router();
const db = require('../models');

// Obtener todos los productos con su categoría
router.get('/', async (req, res) => {
  const products = await db.Product.findAll({ include: db.Category });
  res.json(products);
});

// Crear un producto
router.post('/', async (req, res) => {
  const product = await db.Product.create(req.body);
  res.json(product);
});

// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
  try {
    const { name, quantity, category_id, imageUrl } = req.body;
    const producto = await db.Product.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    producto.name = name;
    producto.quantity = quantity;
    producto.category_id = category_id;
    producto.imageUrl = imageUrl;

    await producto.save();
    res.json({ mensaje: 'Producto actualizado', producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
  try {
    const producto = await db.Product.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
});

// Obtener productos por categoría
router.get('/categoria/:id', async (req, res) => {
  try {
    const productos = await db.Product.findAll({
      where: { category_id: req.params.id },
      include: {
        model: db.Category,
        attributes: ['name']
      },
      attributes: ['id', 'name', 'quantity', 'imageUrl']
    });

    const resultado = productos.map(p => ({
      id: p.id,
      name: p.name,
      quantity: p.quantity,
      categoria: p.Category ? p.Category.name : null,
      imageUrl: p.imageUrl
    }));

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los productos por categoría' });
  }
});

module.exports = router;
