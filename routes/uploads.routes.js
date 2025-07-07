const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

// Ruta para subir imagen
router.post('/upload', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }

  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

module.exports = router;
