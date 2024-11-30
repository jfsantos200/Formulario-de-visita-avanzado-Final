const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas de API
app.use('/api', apiRoutes);
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos (PDFs)
app.use('/uploads', express.static('uploads'));

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas para servir los archivos HTML
app.use(express.static(path.join(__dirname, 'views')));

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
