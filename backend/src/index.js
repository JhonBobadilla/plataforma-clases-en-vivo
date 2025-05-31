require('dotenv').config(); // <--- IMPORTANTE, DEBE IR ARRIBA DE TODO

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/userRoutes');
const claseRoutes = require('./routes/claseRoutes');
const authRoutes = require('./routes/authRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const livekitRoutes = require('./routes/livekit');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Plataforma Clases en Vivo API',
      version: '1.0.0',
      description: 'Documentación de la API',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, '/routes/*.js')],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Carga de rutas
app.use('/api/health', healthRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/clases', claseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/livekit', livekitRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// ======= Socket.io y Whiteboard colaborativo =======
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*', // o especifica tu frontend si lo prefieres
    methods: ['GET', 'POST'],
  },
});

// Importa y ejecuta el módulo de whiteboard colaborativo:
require('./socket/whiteboard')(io);

// ======= Levantar el servidor HTTP + WS =======
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



