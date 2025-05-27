const express = require('express');
const router = express.Router();
const {
  registerUser,
  listarUsuarios,
  obtenerUsuario,
  editarUsuario,
  eliminarUsuario,
  recuperarPassword,
  resetPassword,
  listarCursosPorUsuario,   // <--- NUEVO
  listarClasesPorUsuario    // <--- NUEVO
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
 *                 description: "Use 'profesor' para profesor/organizador o 'alumno' para alumno/interlocutor/asistente."
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
 *         description: Faltan datos obligatorios o datos inválidos. El rol debe ser 'profesor' o 'alumno'.
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
 *         description: Filtrar por rol ('profesor' o 'alumno')
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

/**
 * @swagger
 * /api/usuarios/recuperar-password:
 *   post:
 *     summary: Solicitar recuperación de contraseña (simulado, devuelve el token)
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@correo.com
 *     responses:
 *       200:
 *         description: Si el usuario existe, se ha enviado un correo de recuperación (simulado).
 *       400:
 *         description: Email es obligatorio
 */

/**
 * @swagger
 * /api/usuarios/reset-password:
 *   post:
 *     summary: Restablecer la contraseña usando token temporal
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - nuevaPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: "f1f2f3f4abcd..."
 *               nuevaPassword:
 *                 type: string
 *                 example: "nuevaClave123"
 *     responses:
 *       200:
 *         description: Contraseña restablecida correctamente
 *       400:
 *         description: Token inválido o expirado
 */

/**
 * @swagger
 * /api/usuarios/{id}/cursos:
 *   get:
 *     summary: Listar cursos de un usuario (profesor = creados, alumno = inscritos)
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
 *         description: Lista de cursos del usuario
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /api/usuarios/{id}/clases:
 *   get:
 *     summary: Listar clases donde el usuario/alumno está inscrito
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
 *         description: Lista de clases del usuario/alumno
 *       404:
 *         description: Usuario no encontrado
 */

// Endpoints principales
router.post('/registro', registerUser);
router.get('/', listarUsuarios);
router.get('/:id', obtenerUsuario);
router.put('/:id', editarUsuario);
router.delete('/:id', eliminarUsuario);

// Recuperación y reset de contraseña
router.post('/recuperar-password', recuperarPassword);
router.post('/reset-password', resetPassword);

// Filtros avanzados
router.get('/:id/cursos', listarCursosPorUsuario);
router.get('/:id/clases', listarClasesPorUsuario);

module.exports = router;
