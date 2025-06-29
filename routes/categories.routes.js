const express = require('express');
const router = express.Router();
const db = require('../models');

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await db.Category.findAll();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las categorías' });
  }
});

// Crear una nueva categoría
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    }

    const nuevaCategoria = await db.Category.create({ name, description });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la categoría' });
  }
});

// Actualizar una categoría por ID
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const id = req.params.id;

    if (!name) {
      return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    }

    const categoria = await db.Category.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    categoria.name = name;
    if (description !== undefined) categoria.description = description;

    await categoria.save();

    res.json({ mensaje: 'Categoría actualizada', categoria });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la categoría' });
  }
});

// Eliminar una categoría por ID
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const categoria = await db.Category.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    // (Opcional) Validar si la categoría tiene productos antes de eliminar
    const productosAsociados = await db.Product.count({ where: { category_id: id } });
    if (productosAsociados > 0) {
      return res.status(400).json({ mensaje: 'No se puede eliminar la categoría porque tiene productos asociados' });
    }

    await categoria.destroy();

    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ mensaje: 'Error al eliminar la categoría' });
  }
});


module.exports = router;
