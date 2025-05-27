const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

/**
 * @swagger
 * /api/usuarios/registro:
 *   post:
 *     summary: Registrar un usuario (profesor/organizador o alumno/interlocutor)
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *               - rol
 *               - telefono
 *               - pais
 *               - ciudad
 *               - edad
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 example: juan@correo.com
 *               password:
 *                 type: string
 *                 example: clave123
 *               rol:
 *                 type: string
 *                 enum: [profesor, alumno]
 *                 example: profesor
 *                 description: >-
 *                   Use "profesor" para profesor/organizador
 *                   o "alumno" para alumno/interlocutor/asistente.
 *               telefono:
 *                 type: string
 *                 example: "+573001234567"
 *               pais:
 *                 type: string
 *                 example: "Colombia"
 *               ciudad:
 *                 type: string
 *                 example: "Bogotá"
 *               edad:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Faltan datos obligatorios o datos inválidos. El rol debe ser "profesor/organizador" o "alumno/interlocutor".
 *       409:
 *         description: El email ya está registrado
 */
router.post('/registro', registerUser);

module.exports = router;


