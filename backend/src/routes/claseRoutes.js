const express = require('express');
const router = express.Router();
const { verificarToken, requireRole } = require('../middleware/authMiddleware');
const {
  crearClase,
  listarClases,
  obtenerClase,
  inscribirParticipante,
  editarClase,
  eliminarClase
} = require('../controllers/claseController');

/**
 * @swagger
 * /api/clases:
 *   post:
 *     summary: Crear una clase/reunión (solo profesor/organizador)
 *     tags:
 *       - Clases
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *               - fecha
 *               - hora
 *               - profesorId
 *               - cursoId
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Matemáticas 1
 *               descripcion:
 *                 type: string
 *                 example: "Clase de introducción a matemáticas."
 *               fecha:
 *                 type: string
 *                 example: "2025-06-01"
 *               hora:
 *                 type: string
 *                 example: "09:00"
 *               profesorId:
 *                 type: integer
 *                 example: 1
 *               cursoId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Clase/reunión creada correctamente
 *       400:
 *         description: Faltan datos obligatorios
 *       404:
 *         description: El curso especificado no existe.
 *   get:
 *     summary: Listar todas las clases/reuniones
 *     tags:
 *       - Clases
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @swagger
 * /api/clases/{id}:
 *   get:
 *     summary: Obtener detalles de una clase/reunión por id
 *     tags:
 *       - Clases
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Clase/reunión no encontrada
 *   put:
 *     summary: Editar una clase/reunión por id
 *     tags:
 *       - Clases
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
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *               hora:
 *                 type: string
 *     responses:
 *       200:
 *         description: Clase/reunión actualizada.
 *       404:
 *         description: Clase/reunión no encontrada
 *   delete:
 *     summary: Eliminar una clase/reunión por id
 *     tags:
 *       - Clases
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Clase/reunión eliminada correctamente.
 *       404:
 *         description: Clase/reunión no encontrada
 */

/**
 * @swagger
 * /api/clases/{id}/inscribir:
 *   post:
 *     summary: Inscribir participante (alumno/asistente) a una clase/reunión
 *     tags:
 *       - Clases
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
 *             required:
 *               - alumnoId
 *             properties:
 *               alumnoId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Participante inscrito correctamente
 *       404:
 *         description: Clase/reunión no encontrada
 *       409:
 *         description: El usuario ya está inscrito
 */

// SOLO profesor puede crear clase
router.post('/', verificarToken, requireRole('profesor'), crearClase);
// Todos autenticados pueden listar
router.get('/', verificarToken, listarClases);
// Todos autenticados pueden ver detalles
router.get('/:id', verificarToken, obtenerClase);
// SOLO profesor puede editar clase
router.put('/:id', verificarToken, requireRole('profesor'), editarClase);
// SOLO profesor puede eliminar clase
router.delete('/:id', verificarToken, requireRole('profesor'), eliminarClase);
// SOLO alumno puede inscribirse
router.post('/:id/inscribir', verificarToken, requireRole('alumno'), inscribirParticipante);

module.exports = router;
