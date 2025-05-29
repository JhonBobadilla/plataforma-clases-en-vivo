const express = require('express');
const router = express.Router();
const { verificarToken, requireRole } = require('../middleware/authMiddleware');

const {
  crearCurso,
  listarCursos,
  obtenerCurso,
  inscribirAlumno,
  desinscribirAlumno, 
  editarCurso,
  eliminarCurso,
  listarClasesDeCurso,
  getCursosInscritos//AGREGADO PARA LISTAR CURSOS ALUMNO******
} = require('../controllers/cursoController');

/**
 * @swagger
 * /api/cursos:
 *   post:
 *     summary: Crear un curso (solo profesor/organizador)
 *     tags:
 *       - Cursos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - profesorId
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Curso de Matemáticas"
 *               descripcion:
 *                 type: string
 *                 example: "Curso de nivelación para estudiantes de secundaria."
 *               profesorId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Curso creado correctamente
 *       400:
 *         description: Faltan datos obligatorios
 *   get:
 *     summary: Listar todos los cursos
 *     tags:
 *       - Cursos
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @swagger
 * /api/cursos/{id}:
 *   get:
 *     summary: Obtener detalles de un curso por id
 *     tags:
 *       - Cursos
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
 *         description: Curso no encontrado
 *   put:
 *     summary: Editar un curso por id
 *     tags:
 *       - Cursos
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
 *                 example: "Nuevo nombre"
 *               descripcion:
 *                 type: string
 *                 example: "Nueva descripción"
 *     responses:
 *       200:
 *         description: Curso actualizado correctamente
 *       404:
 *         description: Curso no encontrado
 *   delete:
 *     summary: Eliminar un curso por id
 *     tags:
 *       - Cursos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Curso eliminado correctamente
 *       404:
 *         description: Curso no encontrado
 */

/**
 * @swagger
 * /api/cursos/{id}/inscribir:
 *   post:
 *     summary: Inscribir alumno en un curso
 *     tags:
 *       - Cursos
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
 *         description: Alumno inscrito correctamente en el curso
 *       404:
 *         description: Curso no encontrado
 *       409:
 *         description: El usuario ya está inscrito en el curso
 */

/**
 * @swagger
 * /api/cursos/{id}/inscribir:
 *   delete:
 *     summary: Desinscribir alumno de un curso
 *     tags:
 *       - Cursos
 *     security:
 *       - bearerAuth: []
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
 *         description: Desinscripción exitosa del curso
 *       400:
 *         description: El alumno no está inscrito en este curso
 *       404:
 *         description: Curso no encontrado
 */

/**
 * @swagger
 * /api/cursos/{id}/clases:
 *   get:
 *     summary: Ver clases asociadas a un curso
 *     tags:
 *       - Cursos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Lista de clases asociadas al curso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Clase 1"
 *                   descripcion:
 *                     type: string
 *                     example: "Introducción"
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-06-10T10:00:00Z"
 *                   cursoId:
 *                     type: integer
 *                     example: 5
 *       404:
 *         description: Curso no encontrado
 *       401:
 *         description: No autorizado
 */

// SOLO PROFESOR puede crear, editar o borrar cursos
router.post('/', verificarToken, requireRole('profesor'), crearCurso);
router.put('/:id', verificarToken, requireRole('profesor'), editarCurso);
router.delete('/:id', verificarToken, requireRole('profesor'), eliminarCurso);

// Inscribir: solo alumnos autenticados pueden inscribirse
router.post('/:id/inscribir', verificarToken, requireRole('alumno'), inscribirAlumno);

// Desinscribir: solo alumnos autenticados pueden desinscribirse
router.delete('/:id/inscribir', verificarToken, requireRole('alumno'), desinscribirAlumno);

// Listar y ver detalles: solo autenticado (puedes hacerlos públicos si quieres)
router.get('/', verificarToken, listarCursos);

//YO AGREGUÉ ESTO PARA QUE LOS ALUMNOS PUEDAN VER SUS CURSOS
router.get('/inscritos', verificarToken, requireRole("alumno"), getCursosInscritos);

router.get('/:id', verificarToken, obtenerCurso);
router.get('/:id/clases', verificarToken, listarClasesDeCurso);

module.exports = router;
