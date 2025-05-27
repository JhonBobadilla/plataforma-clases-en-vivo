const Curso = require('../models/Curso');
const { cursos, clases } = require('../data/memoria');

// Crear curso
const crearCurso = (req, res) => {
  const { nombre, descripcion, profesorId } = req.body;
  if (!nombre || !descripcion || !profesorId) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  const id = cursos.length + 1;
  const nuevoCurso = new Curso({ id, nombre, descripcion, profesorId });
  nuevoCurso.alumnos = [];
  cursos.push(nuevoCurso);
  res.status(201).json({
    message: 'Curso creado correctamente',
    curso: nuevoCurso
  });
};

// Listar todos los cursos
const listarCursos = (req, res) => {
  res.status(200).json(cursos);
};

// Obtener curso por id
const obtenerCurso = (req, res) => {
  const { id } = req.params;
  const curso = cursos.find(c => c.id === parseInt(id));
  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado.' });
  }
  res.status(200).json(curso);
};

// Inscribir alumno en curso
const inscribirAlumno = (req, res) => {
  const { id } = req.params;
  const { alumnoId } = req.body;
  const curso = cursos.find(c => c.id === parseInt(id));
  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado.' });
  }
  if (!alumnoId) {
    return res.status(400).json({ message: 'alumnoId es obligatorio.' });
  }
  if (!curso.alumnos) curso.alumnos = [];
  if (curso.alumnos.includes(alumnoId)) {
    return res.status(409).json({ message: 'El usuario ya está inscrito en el curso.' });
  }
  curso.alumnos.push(alumnoId);
  res.status(200).json({ message: 'Alumno inscrito correctamente en el curso.', curso });
};

// ** Nuevo: Desinscribir alumno de curso **
const desinscribirAlumno = (req, res) => {
  const { id } = req.params;
  const { alumnoId } = req.body;
  const curso = cursos.find(c => c.id === parseInt(id));
  if (!curso) {
    return res.status(404).json({ message: 'Curso no encontrado.' });
  }
  if (!alumnoId) {
    return res.status(400).json({ message: 'alumnoId es obligatorio.' });
  }
  if (!curso.alumnos || !curso.alumnos.includes(alumnoId)) {
    return res.status(404).json({ message: 'El alumno no está inscrito en el curso.' });
  }
  curso.alumnos = curso.alumnos.filter(a => a !== alumnoId);
  res.status(200).json({ message: 'Alumno desinscrito correctamente del curso.', curso });
};

// Editar curso
const editarCurso = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  const curso = cursos.find(c => c.id === parseInt(id));
  if (!curso) return res.status(404).json({ message: 'Curso no encontrado.' });
  if (nombre) curso.nombre = nombre;
  if (descripcion) curso.descripcion = descripcion;
  res.status(200).json({ message: 'Curso actualizado correctamente.', curso });
};

// Eliminar curso
const eliminarCurso = (req, res) => {
  const { id } = req.params;
  const idx = cursos.findIndex(c => c.id === parseInt(id));
  if (idx === -1) return res.status(404).json({ message: 'Curso no encontrado.' });
  cursos.splice(idx, 1);
  res.status(200).json({ message: 'Curso eliminado correctamente.' });
};

// Listar clases de un curso
const listarClasesDeCurso = (req, res) => {
  const { id } = req.params;
  const clasesCurso = clases.filter(c => c.cursoId === parseInt(id));
  res.status(200).json(clasesCurso);
};

module.exports = {
  crearCurso,
  listarCursos,
  obtenerCurso,
  inscribirAlumno,
  desinscribirAlumno, // <--- nuevo export
  editarCurso,
  eliminarCurso,
  listarClasesDeCurso,
  cursos
};


