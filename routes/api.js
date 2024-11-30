const express = require('express');
const router = express.Router();
const multer = require('multer');
const QuotesController = require('../controllers/quotesController');
const ClientesController = require('../controllers/clientesController');
const UsuariosController = require('../controllers/usuariosController');
const VisitasController = require('../controllers/visitasController');
const authController = require('../controllers/auth');
const authMiddleware = require('../middlewares/auth'); // Middleware para verificar el JWT

// Configuración de multer para manejar los archivos PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// ===================
// Rutas de Cotizaciones
// ===================
router.post('/quotes', upload.single('pdfAdjunto'), QuotesController.createCotizacion); // Crear cotización
router.get('/quotes', QuotesController.getCotizaciones); // Obtener cotizaciones
router.get('/quotes/:id', QuotesController.getCotizacionById); // Obtener cotización por ID
router.put('/quotes/:id', upload.single('pdfAdjunto'), QuotesController.updateCotizacion); // Actualizar cotización
router.delete('/quotes/:id', QuotesController.deleteCotizacion); // Eliminar cotización

// ===================
// Rutas de Clientes
// ===================
router.get('/clientes', ClientesController.getClientes); // Obtener todos los clientes
router.post('/clientes', ClientesController.createCliente); // Crear un nuevo cliente
router.get('/clientes/:id', ClientesController.getClienteById); // Obtener cliente por ID
router.put('/clientes/:id', ClientesController.updateCliente); // Actualizar cliente
router.delete('/clientes/:id', ClientesController.deleteCliente); // Eliminar cliente

// ===================
// Rutas de Usuarios
// ===================
router.get('/usuarios', authMiddleware, UsuariosController.getUsuarios); // Obtener todos los usuarios
router.post('/usuarios', authMiddleware, UsuariosController.createUser); // Crear usuario (solo admin puede crear)
router.delete('/usuarios/:username', authMiddleware, UsuariosController.deleteUsuario); // Eliminar usuario
router.put('/usuarios/:username', authMiddleware, UsuariosController.updateUsuario); // Actualizar usuario

// ===================
// Rutas de Visitas
// ===================
router.post('/visitas', VisitasController.createVisita); // Crear nueva visita
router.get('/visitas', VisitasController.getVisitas); // Obtener todas las visitas
router.delete('/visitas/:id', VisitasController.deleteVisita); // Eliminar visita por ID

// ===================
// Rutas de Autenticación y Login
// ===================
router.post('/login', authController.login); // Iniciar sesión
router.post('/register', authMiddleware, authController.createUser); // Crear usuario (solo admin puede crear usuarios)

// ===================
// Middleware para verificar JWT
// ===================
router.use(authMiddleware); // Agregar el middleware para las rutas que necesitan verificar el token

module.exports = router;
