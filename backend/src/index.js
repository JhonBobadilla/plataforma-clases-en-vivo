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
app.use('/api/health', healthRoutes); // Ruta base para health
app.use('/api/usuarios', userRoutes);
app.use('/api/clases', claseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cursos', cursoRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

const livekitRoutes = require('./routes/livekit');
app.use('/api/livekit', livekitRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


