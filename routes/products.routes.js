const express = require('express');
const router = express.Router();
const db = require('../models');

// Obtener todos los productos con su categoría
router.get('/', async (req, res) => {
  try {
    const productos = await db.Product.findAll({
      include: {
        model: db.Category,
        attributes: ['id', 'name']
      }
    });
    res.json(productos);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
});

// Obtener el total de productos
router.get('/count', async (req, res) => {
  try {
    const total = await db.Product.count();
    res.json(total);
  } catch (error) {
    console.error('❌ Error al contar productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener el total de productos' });
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
    const { id } = req.params;

    const producto = await db.Product.findByPk(id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    await producto.update({ name, quantity, category_id, imageUrl });

    res.json({ mensaje: 'Producto actualizado', producto });
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await db.Product.findByPk(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
});

// Obtener productos por ID de categoría
router.get('/categoria/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const productos = await db.Product.findAll({
      where: { category_id: id },
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
