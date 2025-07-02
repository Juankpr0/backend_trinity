const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'ApiTrinity';
const User = db.User;

// ✅ Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios (incluyendo rol)' });
  }

  try {
    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ mensaje: 'Ya existe un usuario con ese correo' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol
    });

    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error('Error en /register:', error);
    return res.status(500).json({ mensaje: 'Error interno al registrar usuario' });
  }
});

// ✅ Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Correo y contraseña obligatorios' });
  }

  try {
    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas (correo)' });
    }

    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecto) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas (contraseña)' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en /login:', error);
    return res.status(500).json({ mensaje: 'Error interno al iniciar sesión' });
  }
});

// ✅ Crear usuario desde panel (sin login)
router.post('/users', async (req, res) => {
  const { email, password, nombre, rol } = req.body;

  if (!email || !password || !nombre || !rol) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    const existente = await User.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya existe un usuario con ese correo' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await User.create({ email, password: hashedPassword, nombre, rol });

    return res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error('Error en /users (POST):', error);
    return res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
});

// ✅ Obtener lista de usuarios (para frontend)
router.get('/users', async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'rol', 'createdAt']
    });
    return res.json(usuarios);
  } catch (error) {
    console.error('Error en /users (GET):', error);
    return res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});

module.exports = router;
