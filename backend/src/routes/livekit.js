const express = require('express');
const router = express.Router();
const { AccessToken } = require('livekit-server-sdk');

// Si usas variables de entorno (recomendado)
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'APIRxb2DbKssNqr';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'MnzQv43Nk3xR9isfZUXXT7FXwvbSlIxxRghn5c9i5EN';

/**
 * @swagger
 * /api/livekit/token:
 *   post:
 *     summary: Genera un token JWT de LiveKit para una sala de videollamada.
 *     tags:
 *       - Videollamada (LiveKit)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "1"
 *               userName:
 *                 type: string
 *                 example: "ProfesorDemo"
 *               roomName:
 *                 type: string
 *                 example: "clase-prueba-1"
 *     responses:
 *       200:
 *         description: Token generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiJ9...
 *       400:
 *         description: Faltan datos obligatorios
 *       500:
 *         description: Error generando token
 */

// Ruta POST para generar el token
router.post('/token', async (req, res) => {
  try {
    const { userId, userName, roomName } = req.body;
    if (!userId || !userName || !roomName) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: userId,
      name: userName,
    });
    at.addGrant({ roomJoin: true, room: roomName });

    const token = await at.toJwt();
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error generando token', details: err.message });
  }
});

module.exports = router;
