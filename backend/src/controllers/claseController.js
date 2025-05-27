const Clase = require('../models/Clase');
const { clases, cursos } = require('../data/memoria');


// Crear clase/reunión (requiere cursoId válido)
const crearClase = (req, res) => {
  const { titulo, descripcion, fecha, hora, profesorId, cursoId } = req.body;
  if (!titulo || !descripcion || !fecha || !hora || !profesorId || !cursoId) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  // Valida que el curso exista
  const curso = cursos.find(c => c.id === parseInt(cursoId));
  if (!curso) {
    return res.status(404).json({ message: 'El curso especificado no existe.' });
  }
  const id = clases.length + 1;
  const nuevaClase = new Clase({ id, titulo, descripcion, fecha, hora, profesorId, cursoId });
  clases.push(nuevaClase);
  res.status(201).json({
    message: 'Clase/reunión creada correctamente',
    clase: nuevaClase
  });
};

// Listar todas las clases o filtrar por cursoId
const listarClases = (req, res) => {
  const { cursoId } = req.query;
  if (cursoId) {
    const filtradas = clases.filter(c => c.cursoId === parseInt(cursoId));
    return res.status(200).json(filtradas);
  }
  res.status(200).json(clases);
};

// Obtener clase/reunión por id
const obtenerClase = (req, res) => {
  const { id } = req.params;
  const clase = clases.find(c => c.id === parseInt(id));
  if (!clase) {
    return res.status(404).json({ message: 'Clase/reunión no encontrada.' });
  }
  res.status(200).json(clase);
};

// Inscribir participante en clase/reunión
const inscribirParticipante = (req, res) => {
  const { id } = req.params;
  const { alumnoId } = req.body;
  const clase = clases.find(c => c.id === parseInt(id));
  if (!clase) {
    return res.status(404).json({ message: 'Clase/reunión no encontrada.' });
  }
  if (!alumnoId) {
    return res.status(400).json({ message: 'alumnoId es obligatorio.' });
  }
  if (clase.participantes.includes(alumnoId)) {
    return res.status(409).json({ message: 'El usuario ya está inscrito.' });
  }
  clase.participantes.push(alumnoId);
  res.status(200).json({ message: 'Participante inscrito correctamente.', clase });
};

// Editar clase/reunión
const editarClase = (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha, hora } = req.body;
  const clase = clases.find(c => c.id === parseInt(id));
  if (!clase) return res.status(404).json({ message: 'Clase/reunión no encontrada.' });
  if (titulo) clase.titulo = titulo;
  if (descripcion) clase.descripcion = descripcion;
  if (fecha) clase.fecha = fecha;
  if (hora) clase.hora = hora;
  res.status(200).json({ message: 'Clase/reunión actualizada.', clase });
};

// Eliminar clase/reunión
const eliminarClase = (req, res) => {
  const { id } = req.params;
  const idx = clases.findIndex(c => c.id === parseInt(id));
  if (idx === -1) return res.status(404).json({ message: 'Clase/reunión no encontrada.' });
  clases.splice(idx, 1);
  res.status(200).json({ message: 'Clase/reunión eliminada correctamente.' });
};

module.exports = {
  crearClase,
  listarClases,
  obtenerClase,
  inscribirParticipante,
  editarClase,
  eliminarClase,
  clases
};
