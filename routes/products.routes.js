const express = require('express');
const router = express.Router();
const db = require('../models');

// Obtener todos los productos con su categoría
router.get('/', async (req, res) => {
  try {
    const productos = await db.Product.findAll({ include: db.Category });
    res.json(productos);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { name, quantity, category_id, imageUrl } = req.body;

    if (!name || quantity == null || !category_id) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    const nuevoProducto = await db.Product.create({
      name,
      quantity,
      category_id,
      imageUrl
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error al crear el producto' });
  }
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
    console.error('❌ Error al actualizar producto:', error);
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
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
});

// Obtener productos por ID de categoría
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
    console.error('❌ Error al obtener productos por categoría:', error);
    res.status(500).json({ mensaje: 'Error al obtener los productos por categoría' });
  }
});

module.exports = router;
