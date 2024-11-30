const pool = require('../models/db'); // Conexion a la base de datos 
const fs = require('fs'); // Para eliminar archivos PDF si es necesario
const path = require('path'); // Para manejar las rutas de archivos

// Crear una nueva cotización con PDF adjunto
exports.createCotizacion = async (req, res) => {
  const { clienteEnvio, productoEnvio, cantidadEnvio, precioEnvio, fechaEntrega, correoCliente } = req.body;
  let pdfAdjunto = null;

  // Verificar si se ha subido un archivo PDF
  if (req.file) {
    pdfAdjunto = req.file.path; // Guardar la ruta del archivo subido
  }

  // Asegurarse de que no haya datos faltantes
  if (!clienteEnvio || !productoEnvio || !cantidadEnvio || !precioEnvio || !fechaEntrega || !correoCliente) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Inserción en la tabla quotes
    const result = await pool.query(
      'INSERT INTO quotes (cliente_id, producto, cantidad, precio_unitario, fecha_entrega, correo_cliente, pdf_adjunto) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [clienteEnvio, productoEnvio, cantidadEnvio, precioEnvio, fechaEntrega, correoCliente, pdfAdjunto]
    );
    res.status(201).json({ success: true, cotizacion: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todas las cotizaciones (con el nombre del cliente)
exports.getCotizaciones = async (req, res) => {
  try {
    // Obtener cotizaciones y unir con la tabla clients para obtener el nombre del cliente
    const result = await pool.query(`
      SELECT quotes.*, clients.empresa AS cliente_nombre
      FROM quotes
      JOIN clients ON quotes.cliente_id = clients.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una cotización por ID (con el nombre del cliente)
exports.getCotizacionById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT quotes.*, clients.empresa AS cliente_nombre
      FROM quotes
      JOIN clients ON quotes.cliente_id = clients.id
      WHERE quotes.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar una cotización, incluyendo el archivo PDF adjunto
exports.updateCotizacion = async (req, res) => {
  const { id } = req.params;
  const { clienteEnvio, productoEnvio, cantidadEnvio, precioEnvio, fechaEntrega, correoCliente } = req.body;
  let pdfAdjunto = null;

  // Verificar si se ha subido un nuevo archivo PDF
  if (req.file) {
    pdfAdjunto = req.file.path;
  }

  try {
    // Actualizar los datos de la cotización en la base de datos
    const result = await pool.query(
      'UPDATE quotes SET cliente_id = $1, producto = $2, cantidad = $3, precio_unitario = $4, fecha_entrega = $5, correo_cliente = $6, pdf_adjunto = $7 WHERE id = $8 RETURNING *',
      [clienteEnvio, productoEnvio, cantidadEnvio, precioEnvio, fechaEntrega, correoCliente, pdfAdjunto, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    res.json({ success: true, cotizacion: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar una cotización y eliminar el archivo PDF si existe
exports.deleteCotizacion = async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener la ruta del archivo PDF adjunto antes de eliminarlo
    const result = await pool.query('SELECT pdf_adjunto FROM quotes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    const pdfAdjunto = result.rows[0].pdf_adjunto;
    if (pdfAdjunto) {
      // Eliminar el archivo PDF si existe
      fs.unlink(path.resolve(pdfAdjunto), (err) => {
        if (err) console.error('Error al eliminar el archivo:', err);
      });
    }

    // Eliminar la cotización de la base de datos
    await pool.query('DELETE FROM quotes WHERE id = $1', [id]);
    res.status(204).end(); // Responder con un código 204 (sin contenido)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
