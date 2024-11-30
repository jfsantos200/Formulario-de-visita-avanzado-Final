# Formulario-de-visita-avanzado-Final

A4 Soluciones Corporativas - Gestión de Usuarios, Cotizaciones, Clientes y Visitas
Este proyecto es una aplicación web para gestionar usuarios, cotizaciones, clientes y visitas. La aplicación utiliza Node.js, Express, y PostgreSQL como base de datos. También cuenta con autenticación mediante JWT para proteger rutas y asegurar que solo los administradores puedan crear y gestionar usuarios.

Requisitos
Antes de comenzar, asegúrate de tener lo siguiente instalado:

Node.js v14+ (https://nodejs.org/)
PostgreSQL v13+ (https://www.postgresql.org/)

Instalación

1. Clona el repositorio

git clone https://github.com/tu-repositorio/a4-soluciones.git
cd a4-soluciones

2. Instalar las dependencias

npm install
Este comando instalará todas las bibliotecas necesarias listadas en el archivo package.json.

Bibliotecas utilizadas:
express: Framework para Node.js
pg: Conexión a PostgreSQL
bcrypt: Encriptación de contraseñas
jsonwebtoken (JWT): Para manejar la autenticación y autorización
multer: Para manejar la subida de archivos (PDFs adjuntos en cotizaciones)
dotenv: Para manejar las variables de entorno

3. Configurar la base de datos
Crea la base de datos en PostgreSQL utilizando el siguiente script.

Script para la base de datos:

-- Crear base de datos
CREATE DATABASE visitasDB;

-- Conectarse a la base de datos
\c visitasDB;

-- Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Crear tabla de clientes
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    empresa VARCHAR(100),
    rnc VARCHAR(50),
    rubro VARCHAR(100),
    telefono VARCHAR(50),
    direccion VARCHAR(100),
    email VARCHAR(100)
);

-- Crear tabla de cotizaciones
CREATE TABLE quotes (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clients(id),
    producto VARCHAR(100),
    cantidad INT,
    precio_unitario DECIMAL(10, 2),
    fecha_entrega DATE,
    correo_cliente VARCHAR(100),
    pdf_adjunto VARCHAR(255)
);

-- Crear tabla de visitas
CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    fecha DATE,
    motivo TEXT
);

-- Insertar usuario admin (admin:1234)
INSERT INTO users (username, full_name, password, role) 
VALUES ('admin', 'Administrador', '$2b$10$V.nKrKlAhjbEa5y2wEdyf.5dXJjCdRZkwcT/dmUqypJ.QORciViJ', 'admin') 
ON CONFLICT (username) DO NOTHING;

4. Configurar las variables de entorno
   
Crea un archivo .env en la raíz del proyecto y agrega la configuración de la base de datos y el JWT.

.env:

DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=visitasDB

JWT_SECRET=Rt0FhWfsS5

5. Ejecutar la aplicación
   
Para iniciar el servidor, ejecuta:


npm start
Esto ejecutará el servidor en http://localhost:3000.

6. Rutas de la aplicación
   
Autenticación:

POST /api/login: Iniciar sesión
Parámetros: username, password
Respuesta: Token JWT
Usuarios (solo administradores):
GET /api/usuarios: Obtener todos los usuarios
POST /api/usuarios: Crear un usuario
Parámetros: username, full_name, password, role (admin o vendedor)
DELETE /api/usuarios/:username: Eliminar un usuario
PUT /api/usuarios/:username: Actualizar un usuario

Clientes:
GET /api/clientes: Obtener todos los clientes
POST /api/clientes: Crear un nuevo cliente
GET /api/clientes/:id: Obtener un cliente por ID
PUT /api/clientes/:id: Actualizar un cliente
DELETE /api/clientes/:id: Eliminar un cliente

Cotizaciones:
POST /api/quotes: Crear una nueva cotización (puede adjuntar un PDF)
GET /api/quotes: Obtener todas las cotizaciones
GET /api/quotes/:id: Obtener una cotización por ID
PUT /api/quotes/:id: Actualizar una cotización
DELETE /api/quotes/:id: Eliminar una cotización

Visitas:
POST /api/visitas: Crear una nueva visita
GET /api/visitas: Obtener todas las visitas
DELETE /api/visitas/:id: Eliminar una visita

8. Subida de archivos (cotizaciones con PDF adjunto)
Los archivos PDF adjuntos en las cotizaciones se guardan en la carpeta uploads/. Puedes modificar esta configuración en el archivo api.js con la configuración de Multer.

9. Notas adicionales
Asegúrate de que PostgreSQL esté corriendo antes de iniciar la aplicación.
Puedes modificar la variable JWT_SECRET en el archivo .env por una cadena más segura.
En caso de problemas, verifica que los valores de las variables de entorno en el archivo .env estén correctamente configurados.

LIBRERIAS Y DEPENDENCIAS UTILIZADAS EN EL PROYECTO:
instalar todas las librerías y dependencias mencionadas en esta aplicacion:

Express: Framework web para Node.js.

npm install express
pg: Cliente de PostgreSQL para Node.js.

npm install pg
multer: Middleware para manejar la carga de archivos en Node.js.

npm install multer
cors: Middleware para habilitar CORS (Cross-Origin Resource Sharing).

npm install cors
dotenv: Cargar variables de entorno desde un archivo .env.

npm install dotenv
node-fetch: Cliente HTTP para realizar solicitudes HTTP.

npm install node-fetch

Si aún no has inicializado un proyecto Node.js, puedes hacerlo con el siguiente comando:

npm init -y

2. Instalar Express
Express es un framework web para Node.js. Instálalo con el siguiente comando:

npm install express

3. Instalar Sequelize y PostgreSQL
Sequelize es un ORM (Object-Relational Mapping) para Node.js, y pg y pg-hstore son los paquetes necesarios para conectar Sequelize con PostgreSQL.

npm install sequelize pg pg-hstore

4. Instalar Body-Parser
Body-Parser es un middleware para analizar cuerpos de solicitudes entrantes en un servidor Express.

npm install body-parser

5. Instalar Dotenv (Opcional)
Si deseas manejar variables de entorno de manera más segura, puedes instalar dotenv:

npm install dotenv
Si prefieres instalar todas las dependencias en un solo comando, puedes usar:

npm install express pg multer cors dotenv node-fetch

