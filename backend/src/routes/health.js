// backend/src/routes/health.js
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verifica el estado de la API
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API funcionando correctamente' });
});

module.exports = router;
