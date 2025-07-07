const express = require('express');
const router = express.Router();
const db = require('../models');
const upload = require('../middlewares/upload'); // <-- middleware multer
const path = require('path');

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await db.Category.findAll();
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ mensaje: 'Error al obtener las categorías' });
  }
});

// Crear una nueva categoría (multipart/form-data con imagen)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || name.trim() === '') {
      return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    }

    const nuevaCategoria = await db.Category.create({
      name: name.trim(),
      description: description || null,
      imageUrl
    });

    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ mensaje: 'Error al crear la categoría' });
  }
});

// Actualizar una categoría por ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    if (!name || name.trim() === '') {
      return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    }

    const categoria = await db.Category.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : categoria.imageUrl;

    await categoria.update({
      name: name.trim(),
      description: description ?? categoria.description,
      imageUrl
    });

    res.json({ mensaje: 'Categoría actualizada correctamente', categoria });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ mensaje: 'Error al actualizar la categoría' });
  }
});

// Eliminar una categoría por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await db.Category.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    const productosAsociados = await db.Product.count({ where: { category_id: id } });
    if (productosAsociados > 0) {
      return res.status(400).json({
        mensaje: 'No se puede eliminar la categoría porque tiene productos asociados',
      });
    }

    await categoria.destroy();
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ mensaje: 'Error al eliminar la categoría' });
  }
});

// Obtener resumen de stock por categoría
router.get('/resumen', async (req, res) => {
  try {
    const resumen = await db.sequelize.query(`
      SELECT c.id, c.name AS categoria, c.imageUrl, COUNT(p.id) AS total
      FROM Categories c
      LEFT JOIN Products p ON c.id = p.category_id
      GROUP BY c.id, c.name, c.imageUrl
      ORDER BY c.name ASC;
    `, { type: db.sequelize.QueryTypes.SELECT });

    const total_productos = resumen.reduce((acc, item) => acc + parseInt(item.total), 0);
    const ultimaActualizacion = await db.Product.max('updatedAt');

    res.json([{
      resumen,
      total_productos,
      ultima_actualizacion: ultimaActualizacion || null
    }]);
  } catch (error) {
    console.error('Error al generar resumen:', error);
    res.status(500).json({ mensaje: 'Error al obtener el resumen de categorías' });
  }
});

module.exports = router;
