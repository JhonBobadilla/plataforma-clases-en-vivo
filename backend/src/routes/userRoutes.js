const express = require('express');
const router = express.Router();
const {
  registerUser,
  listarUsuarios,
  obtenerUsuario,
  editarUsuario,
  eliminarUsuario
} = require('../controllers/userController');

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

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos los usuarios o filtrar por rol
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - name: rol
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar por rol (profesor o alumno)
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener detalles de usuario por id
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *   put:
 *     summary: Editar un usuario por id
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               password:
 *                 type: string
 *               telefono:
 *                 type: string
 *               pais:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               edad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 *   delete:
 *     summary: Eliminar usuario por id
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */

router.post('/registro', registerUser);
router.get('/', listarUsuarios);
router.get('/:id', obtenerUsuario);
router.put('/:id', editarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;
