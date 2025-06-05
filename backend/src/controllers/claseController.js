const pool = require('../config/db');

// Crear clase/reunión (requiere cursoId válido)
const crearClase = async (req, res) => {
  const { titulo, descripcion, fecha, hora, profesorId, cursoId } = req.body;
  if (!titulo || !descripcion || !fecha || !hora || !profesorId || !cursoId) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  try {
    // ------- LOG DE ENTRADA -------
    console.log('Voy a guardar:');
    console.log('titulo:', titulo);
    console.log('descripcion:', descripcion);
    console.log('fecha:', fecha);
    console.log('hora:', hora);
    console.log('profesorId:', profesorId);
    console.log('cursoId:', cursoId);

    // Valida que el curso exista
    const curso = await pool.query('SELECT * FROM cursos WHERE id = $1', [cursoId]);
    if (curso.rows.length === 0) {
      return res.status(404).json({ message: 'El curso especificado no existe.' });
    }
    const result = await pool.query(
      `INSERT INTO clases (titulo, descripcion, fecha, hora, profesor_id, curso_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [titulo, descripcion, fecha, hora, profesorId, cursoId]
    );
    return res.status(201).json({
      message: 'Clase/reunión creada correctamente',
      clase: result.rows[0]
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error creando clase', error: err.message });
  }
};

// Listar todas las clases o filtrar por cursoId
const listarClases = async (req, res) => {
  const { cursoId } = req.query;
  try {
    let result;
    if (cursoId) {
      result = await pool.query('SELECT * FROM clases WHERE curso_id = $1', [cursoId]);
    } else {
      result = await pool.query('SELECT * FROM clases');
    }
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: 'Error listando clases', error: err.message });
  }
};

// Obtener clase/reunión por id
const obtenerClase = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM clases WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Clase/reunión no encontrada.' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Error obteniendo clase', error: err.message });
  }
};

// Inscribir participante en clase/reunión
const inscribirParticipante = async (req, res) => {
  const { id } = req.params; // id de la clase
  const { alumnoId } = req.body;
  if (!alumnoId) {
    return res.status(400).json({ message: 'alumnoId es obligatorio.' });
  }
  try {
    // Valida que la clase exista
    const clase = await pool.query('SELECT * FROM clases WHERE id = $1', [id]);
    if (clase.rows.length === 0) {
      return res.status(404).json({ message: 'Clase/reunión no encontrada.' });
    }
    // Verifica si ya está inscrito
    const yaInscrito = await pool.query(
      'SELECT * FROM clases_participantes WHERE clase_id = $1 AND participante_id = $2',
      [id, alumnoId]
    );
    if (yaInscrito.rows.length > 0) {
      return res.status(409).json({ message: 'El usuario ya está inscrito.' });
    }
    await pool.query(
      'INSERT INTO clases_participantes (clase_id, participante_id) VALUES ($1, $2)',
      [id, alumnoId]
    );
    return res.status(200).json({ message: 'Participante inscrito correctamente.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error inscribiendo participante', error: err.message });
  }
};

// DESINSCRIBIR participante de clase/reunión
const desinscribirParticipante = async (req, res) => {
  const { id } = req.params; // id de la clase
  // 👇 NUEVA línea tolerante (no revienta si body es undefined)
  const alumnoId = (req.body && req.body.alumnoId) || req.query.alumnoId;
  if (!alumnoId) {
    return res.status(400).json({ message: 'alumnoId es obligatorio.' });
  }
  try {
    // Valida que la clase exista
    const clase = await pool.query('SELECT * FROM clases WHERE id = $1', [id]);
    if (clase.rows.length === 0) {
      return res.status(404).json({ message: 'Clase/reunión no encontrada.' });
    }
    // Verifica si está inscrito
    const yaInscrito = await pool.query(
      'SELECT * FROM clases_participantes WHERE clase_id = $1 AND participante_id = $2',
      [id, alumnoId]
    );
    if (yaInscrito.rows.length === 0) {
      return res.status(400).json({ message: 'El alumno no está inscrito en esta clase.' });
    }
    await pool.query(
      'DELETE FROM clases_participantes WHERE clase_id = $1 AND participante_id = $2',
      [id, alumnoId]
    );
    return res.status(200).json({ message: 'Participante desinscrito correctamente.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error desinscribiendo participante', error: err.message });
  }
};

// Editar clase/reunión
const editarClase = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha, hora } = req.body;
  try {
    const result = await pool.query('SELECT * FROM clases WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Clase/reunión no encontrada.' });
    }
    // Actualiza solo los campos enviados
    const claseActual = result.rows[0];
    const nuevoTitulo = titulo || claseActual.titulo;
    const nuevaDescripcion = descripcion || claseActual.descripcion;
    const nuevaFecha = fecha || claseActual.fecha;
    const nuevaHora = hora || claseActual.hora;

    await pool.query(
      'UPDATE clases SET titulo = $1, descripcion = $2, fecha = $3, hora = $4 WHERE id = $5',
      [nuevoTitulo, nuevaDescripcion, nuevaFecha, nuevaHora, id]
    );
    return res.status(200).json({ message: 'Clase/reunión actualizada.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error actualizando clase', error: err.message });
  }
};

// Eliminar clase/reunión
const eliminarClase = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM clases WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Clase/reunión no encontrada.' });
    }
    return res.status(200).json({ message: 'Clase/reunión eliminada correctamente.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error eliminando clase', error: err.message });
  }
};

module.exports = {
  crearClase,
  listarClases,
  obtenerClase,
  inscribirParticipante,
  desinscribirParticipante,
  editarClase,
  eliminarClase,
};




