router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol } = req.body;

  try {
    const usuario = await db.User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }


    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (rol) usuario.rol = rol;

    await usuario.save();

    res.json({
      mensaje: 'Usuario actualizado correctamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        updatedAt: usuario.updatedAt
      }
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error interno al actualizar el usuario' });
  }
});


router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await db.User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    await usuario.destroy();

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error interno al eliminar el usuario' });
  }
});
