const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const healthRoutes = require('./routes/health');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger config
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Plataforma Clases en Vivo API',
      version: '1.0.0',
      description: 'Documentación de la API',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: [path.join(__dirname, '/routes/*.js')], // <-- Así encuentra los JSDoc
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Carga de rutas
app.use('/api', healthRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

