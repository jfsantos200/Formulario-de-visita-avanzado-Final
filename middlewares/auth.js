const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar las variables de entorno

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];  // "Bearer [token]"

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Agregar la información del usuario al objeto req
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token no válido o expirado.' });
    }
};