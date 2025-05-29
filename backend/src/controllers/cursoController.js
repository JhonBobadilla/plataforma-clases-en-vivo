const pool = require('../config/db');

// Crear curso
const crearCurso = async (req, res) => {
  const { nombre, descripcion, profesorId } = req.body;
  if (!nombre || !descripcion || !profesorId) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  try {
    // Valida que el profesor exista
    const profesor = await pool.query('SELECT * FROM usuarios WHERE id = $1 AND rol = $2', [profesorId, 'profesor']);
    if (profesor.rows.length === 0) {
      return res.status(404).json({ message: 'El profesor especificado no existe.' });
    }
    const result = await pool.query(
      'INSERT INTO cursos (nombre, descripcion, profesor_id) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion, profesorId]
    );
    return res.status(201).json({
      message: 'Curso creado correctamente',
      curso: result.rows[0],
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error creando curso', error: err.message });
  }
};

// Listar todos los cursos
const listarCursos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cursos');
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: 'Error listando cursos', error: err.message });
  }
};

// Obtener curso por id
const obtenerCurso = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM cursos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado.' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Error obteniendo curso', error: err.message });
  }
};

// Inscribir alumno en curso
const inscribirAlumno = async (req, res) => {
  const { id } = req.params; // id del curso
  const { alumnoId } = req.body;
  if (!alumnoId) {
    return res.status(400).json({ message: 'alumnoId es obligatorio.' });
  }
  try {
    // Valida que el curso exista
    const curso = await pool.query('SELECT * FROM cursos WHERE id = $1', [id]);
    if (curso.rows.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado.' });
    }
    // Valida que el alumno exista
    const alumno = await pool.query('SELECT * FROM usuarios WHERE id = $1 AND rol = $2', [alumnoId, 'alumno']);
    if (alumno.rows.length === 0) {
      return res.status(404).json({ message: 'El alumno especificado no existe.' });
    }
    // Verifica si ya está inscrito
    const yaInscrito = await pool.query(
      'SELECT * FROM cursos_alumnos WHERE curso_id = $1 AND alumno_id = $2',
      [id, alumnoId]
    );
    if (yaInscrito.rows.length > 0) {
      return res.status(409).json({ message: 'El usuario ya está inscrito en el curso.' });
    }
    await pool.query(
      'INSERT INTO cursos_alumnos (curso_id, alumno_id) VALUES ($1, $2)',
      [id, alumnoId]
    );
    return res.status(200).json({ message: 'Alumno inscrito correctamente en el curso.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error inscribiendo alumno', error: err.message });
  }
};

// Desinscribir alumno de curso
const desinscribirAlumno = async (req, res) => {
  const { id } = req.params; // id del curso
  const { alumnoId } = req.body;
  if (!alumnoId) {
    return res.status(400).json({ message: 'alumnoId es obligatorio.' });
  }
  try {
    // Valida que el curso exista
    const curso = await pool.query('SELECT * FROM cursos WHERE id = $1', [id]);
    if (curso.rows.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado.' });
    }
    // Verifica si está inscrito
    const yaInscrito = await pool.query(
      'SELECT * FROM cursos_alumnos WHERE curso_id = $1 AND alumno_id = $2',
      [id, alumnoId]
    );
    if (yaInscrito.rows.length === 0) {
      return res.status(404).json({ message: 'El alumno no está inscrito en el curso.' });
    }
    await pool.query(
      'DELETE FROM cursos_alumnos WHERE curso_id = $1 AND alumno_id = $2',
      [id, alumnoId]
    );
    return res.status(200).json({ message: 'Alumno desinscrito correctamente del curso.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error desinscribiendo alumno', error: err.message });
  }
};

// Editar curso
const editarCurso = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query('SELECT * FROM cursos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado.' });
    }
    const cursoActual = result.rows[0];
    const nuevoNombre = nombre || cursoActual.nombre;
    const nuevaDescripcion = descripcion || cursoActual.descripcion;
    await pool.query(
      'UPDATE cursos SET nombre = $1, descripcion = $2 WHERE id = $3',
      [nuevoNombre, nuevaDescripcion, id]
    );
    return res.status(200).json({ message: 'Curso actualizado correctamente.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error actualizando curso', error: err.message });
  }
};

// Eliminar curso
const eliminarCurso = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM cursos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado.' });
    }
    return res.status(200).json({ message: 'Curso eliminado correctamente.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error eliminando curso', error: err.message });
  }
};

// Listar clases de un curso
const listarClasesDeCurso = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM clases WHERE curso_id = $1', [id]);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: 'Error listando clases de curso', error: err.message });
  }
};


//AGREGADO PARA LISTAR CURSOS ALUMNO*****.
// Obtener cursos a los que el alumno está inscrito
const getCursosInscritos = async (req, res) => {
  try {
    // Usa el id del usuario autenticado
    const alumnoId = req.user.id;

    // Busca todos los cursos donde el alumno está inscrito
    const result = await pool.query(
      `SELECT c.* 
         FROM cursos c
         JOIN cursos_alumnos ca ON ca.curso_id = c.id
        WHERE ca.alumno_id = $1`,
      [alumnoId]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: 'Error obteniendo cursos inscritos', error: err.message });
  }
};

module.exports = {
  crearCurso,
  listarCursos,
  obtenerCurso,
  inscribirAlumno,
  desinscribirAlumno,
  editarCurso,
  eliminarCurso,
  listarClasesDeCurso,
  //****** AGREGADO PARA LISTAR CURSOS ALUMNO*****.
  getCursosInscritos,
};



