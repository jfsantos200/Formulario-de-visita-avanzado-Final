const pool = require('../models/db'); // Conexión a la base de datos

// Crear nueva visita
exports.createVisita = async (req, res) => {
  const { nombre, apellido, fecha, motivo } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO visits (nombre, apellido, fecha, motivo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellido, fecha, motivo]
    );
    res.status(201).json({ success: true, visita: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al registrar la visita', error: err.message });
  }
};

// Obtener todas las visitas
exports.getVisitas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM visits');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al obtener las visitas', error: err.message });
  }
};

// Eliminar una visita por ID
exports.deleteVisita = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM visits WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Visita no encontrada' });
    }

    res.status(200).json({ success: true, message: 'Visita eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al eliminar la visita', error: err.message });
  }
};
