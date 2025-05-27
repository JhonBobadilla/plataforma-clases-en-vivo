const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario (profesor/organizador o alumno/interlocutor)
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@correo.com
 *               password:
 *                 type: string
 *                 example: clave123
 *     responses:
 *       200:
 *         description: Login exitoso, retorna JWT
 *       400:
 *         description: Faltan datos obligatorios
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', loginUser);

module.exports = router;
