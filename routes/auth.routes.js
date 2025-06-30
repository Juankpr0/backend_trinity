const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'ApiTrinity';

// Ruta: POST /api/register
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  // Validación básica
  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si ya existe un usuario con ese email
    const usuarioExistente = await db.User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ mensaje: 'Ya existe un usuario con ese correo' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = await db.User.create({
      nombre,
      email,
      password: hashedPassword
    });

    // Opcional: No devolver la contraseña en la respuesta
    const usuarioSinPassword = {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email
    };

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: usuarioSinPassword
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario' });
  }
});

// Ruta: POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await db.User.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas (email)' });
    }

    const passwordCorrecto = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecto) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas (contraseña)' });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});


module.exports = router;
