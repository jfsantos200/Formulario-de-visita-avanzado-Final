const pool = require('../models/db'); // Conexión a la base de datos
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Asegúrate de que el archivo .env esté configurado

// Login de usuario
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificar si el usuario existe por username
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Nombre de usuario no encontrado' });
        }

        // Comparar la contraseña
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        
        if (!validPassword) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Generar el token JWT usando la clave secreta
        const token = jwt.sign(
            { id: user.rows[0].id, username: user.rows[0].username, role: user.rows[0].role },
            process.env.JWT_SECRET,  // Usa la clave secreta desde el archivo .env
            { expiresIn: '1h' } // El token expira en 1 hora
        );

        // Guardar el token en la base de datos en el campo jwt_token
        await pool.query('UPDATE users SET jwt_token = $1 WHERE id = $2', [token, user.rows[0].id]);

        res.json({ message: 'Login successful', token, user: user.rows[0] });
    } catch (err) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
    }
};

// Crear nuevo usuario (solo admin)
exports.createUser = async (req, res) => {
    const { username, full_name, password, role } = req.body;

    // Verificar si el usuario que hace la petición es admin
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

        // Crear el usuario
        const result = await pool.query(
            'INSERT INTO users (username, full_name, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, full_name, hashedPassword, role]
        );

        res.status(201).json({ message: 'Usuario creado con éxito', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el usuario', error: err.message });
    }
};

// Verificar si el token JWT es válido
exports.verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // "Bearer [token]"

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Verificar si el token está almacenado en la base de datos
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

        if (user.rows.length === 0 || user.rows[0].jwt_token !== token) {
            return res.status(401).json({ message: 'Token no válido o expirado.' });
        }

        req.user = decoded;  // Agregar los datos del usuario al objeto req
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token no válido o expirado.' });
    }
};
