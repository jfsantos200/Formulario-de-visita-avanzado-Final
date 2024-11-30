const pool = require('../models/db');

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo cliente
exports.createCliente = async (req, res) => {
  const { empresa, rnc, rubro, telefono, direccion, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clients (empresa, rnc, rubro, telefono, direccion, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [empresa, rnc, rubro, telefono, direccion, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Obtener un cliente por ID
// exports.getClienteById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query('SELECT * FROM clients WHERE id = 1', [id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Cliente no encontrado' });
//     }
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Error al obtener el cliente' });
//   }
// };


// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
  const { id } = req.params;  // Obtener el ID del cliente desde los parámetros de la URL

  try {
    // Asegúrate de que la consulta está esperando un parámetro para el ID del cliente
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);

    // Si no se encuentra el cliente, devolver un error 404
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Si el cliente es encontrado, devolverlo en la respuesta
    res.json(result.rows[0]);
  } catch (err) {
    // En caso de error en la consulta, devolver un error 500
    res.status(500).json({ error: err.message });
  }
};

// Actualizar los datos de un cliente
exports.updateCliente = async (req, res) => {
  const { id } = req.params;
  const { empresa, rnc, rubro, telefono, direccion, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE clients SET empresa = $1, rnc = $2, rubro = $3, telefono = $4, direccion = $5, email = $6 WHERE id = $7 RETURNING *',
      [empresa, rnc, rubro, telefono, direccion, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
};

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(204).end(); // No content (Eliminado exitosamente)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
};
