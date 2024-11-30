const pool = require('../models/db'); // Conexión a la base de datos
const bcrypt = require('bcrypt'); // Para encriptar las contraseñas

// Obtener todos los usuarios
exports.getUsuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT username, full_name, role FROM users');
    res.json(result.rows); // Enviar los usuarios en formato JSON
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: err.message });
  }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  const { username, full_name, password, role } = req.body;

  // Solo el admin puede crear usuarios
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden crear usuarios.' });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos, incluyendo el rol
    const result = await pool.query(
      'INSERT INTO users (username, full_name, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, full_name, hashedPassword, role]
    );

    res.status(201).json({ message: 'Usuario creado con éxito', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el usuario', error: err.message });
  }
};

// Eliminar un usuario
exports.deleteUsuario = async (req, res) => {
  const { username } = req.params;

  try {
    // Verificar si el usuario existe
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Eliminar el usuario de la base de datos
    await pool.query('DELETE FROM users WHERE username = $1', [username]);

    res.status(200).json({ message: `Usuario ${username} eliminado con éxito` });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: err.message });
  }
};

// Actualizar los datos de un usuario
exports.updateUsuario = async (req, res) => {
  const { username } = req.params;
  const { full_name, password, role } = req.body;

  try {
    // Verificar si el usuario existe
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Encriptar la nueva contraseña si es proporcionada
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Actualizar los datos del usuario
    const updatedResult = await pool.query(
      'UPDATE users SET full_name = $1, password = $2, role = $3 WHERE username = $4 RETURNING *',
      [full_name, hashedPassword, role, username]
    );

    res.status(200).json({ message: 'Usuario actualizado con éxito', user: updatedResult.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error: err.message });
  }
};
