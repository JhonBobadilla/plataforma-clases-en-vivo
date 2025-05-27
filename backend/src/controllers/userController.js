const pool = require('../config/db');
const crypto = require('crypto');

// Registrar usuario
const registerUser = async (req, res) => {
  const { nombre, email, password, rol, telefono, pais, ciudad, edad } = req.body;

  if (
    !nombre || !email || !password || !rol || !telefono ||
    !pais || !ciudad || !edad
  ) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  if (!['profesor', 'alumno'].includes(rol)) {
    return res.status(400).json({ message: 'Rol no válido. Solo se permite: profesor o alumno.' });
  }

  if (typeof edad !== 'number' || edad < 10 || edad > 120) {
    return res.status(400).json({ message: 'Edad no válida. Debe ser un número entre 10 y 120.' });
  }

  try {
    // Verifica si ya existe
    const existe = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const result = await pool.query(
      `INSERT INTO usuarios 
        (nombre, email, password, rol, telefono, pais, ciudad, edad)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, nombre, email, rol, telefono, pais, ciudad, edad`,
      [nombre, email, password, rol, telefono, pais, ciudad, edad]
    );
    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      usuario: result.rows[0],
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error registrando usuario', error: err.message });
  }
};

// Listar usuarios (todos o por rol)
const listarUsuarios = async (req, res) => {
  const { rol } = req.query;
  try {
    let result;
    if (rol) {
      result = await pool.query('SELECT * FROM usuarios WHERE rol = $1', [rol]);
    } else {
      result = await pool.query('SELECT * FROM usuarios');
    }
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: 'Error listando usuarios', error: err.message });
  }
};

// Obtener usuario por id
const obtenerUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Error obteniendo usuario', error: err.message });
  }
};

// Editar usuario
const editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, password, telefono, pais, ciudad, edad } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Usuario no encontrado.' });

    const user = result.rows[0];

    const updateUser = {
      nombre: nombre || user.nombre,
      password: password || user.password,
      telefono: telefono || user.telefono,
      pais: pais || user.pais,
      ciudad: ciudad || user.ciudad,
      edad: edad || user.edad,
    };

    await pool.query(
      `UPDATE usuarios SET nombre = $1, password = $2, telefono = $3, pais = $4, ciudad = $5, edad = $6 WHERE id = $7`,
      [updateUser.nombre, updateUser.password, updateUser.telefono, updateUser.pais, updateUser.ciudad, updateUser.edad, id]
    );

    return res.status(200).json({ message: 'Usuario actualizado correctamente.', usuario: { id: Number(id), ...updateUser } });
  } catch (err) {
    return res.status(500).json({ message: 'Error actualizando usuario', error: err.message });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    return res.status(200).json({ message: 'Usuario eliminado correctamente.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error eliminando usuario', error: err.message });
  }
};

// Recuperar contraseña (simulado)
const recuperarPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email es obligatorio.' });

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    // Responde igual para no revelar existencia
    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'Si el usuario existe, se ha enviado un correo de recuperación (simulado).' });
    }

    // Genera token temporal (NO se guarda en DB por simplicidad aquí)
    const token = crypto.randomBytes(20).toString('hex');
    // En un sistema real deberías guardar el token y expiración en la tabla usuarios o tabla tokens
    // Aquí lo devolvemos solo para pruebas
    return res.status(200).json({
      message: 'Si el usuario existe, se ha enviado un correo de recuperación (simulado).',
      resetToken: token,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error en la recuperación', error: err.message });
  }
};

// Restablecer contraseña usando token (simulado)
const resetPassword = async (req, res) => {
  // Como no guardamos el token, simulamos el flujo
  const { token, nuevaPassword, email } = req.body;
  if (!token || !nuevaPassword || !email) {
    return res.status(400).json({ message: 'Token, email y nueva contraseña son obligatorios.' });
  }
  // Busca el usuario por email
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Usuario no encontrado.' });

    await pool.query('UPDATE usuarios SET password = $1 WHERE email = $2', [nuevaPassword, email]);
    return res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error restableciendo contraseña', error: err.message });
  }
};

// Listar cursos por usuario (profesor o alumno)
const listarCursosPorUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const userResult = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (userResult.rows.length === 0)
      return res.status(404).json({ message: 'Usuario no encontrado.' });

    const usuario = userResult.rows[0];
    if (usuario.rol === 'profesor') {
      // Cursos creados por profesor
      const result = await pool.query('SELECT * FROM cursos WHERE profesor_id = $1', [usuario.id]);
      return res.status(200).json(result.rows);
    } else if (usuario.rol === 'alumno') {
      // Cursos donde está inscrito (relación cursos_alumnos)
      const result = await pool.query(`
        SELECT c.*
        FROM cursos_alumnos ca
        JOIN cursos c ON ca.curso_id = c.id
        WHERE ca.alumno_id = $1
      `, [usuario.id]);
      return res.status(200).json(result.rows);
    } else {
      return res.status(400).json({ message: 'Rol de usuario inválido.' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Error listando cursos por usuario', error: err.message });
  }
};

// Listar clases por usuario/alumno
const listarClasesPorUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const userResult = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (userResult.rows.length === 0)
      return res.status(404).json({ message: 'Usuario no encontrado.' });

    // Clases donde está inscrito (relación clases_participantes)
    const result = await pool.query(`
      SELECT cl.*
      FROM clases_participantes cp
      JOIN clases cl ON cp.clase_id = cl.id
      WHERE cp.participante_id = $1
    `, [id]);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: 'Error listando clases por usuario', error: err.message });
  }
};

module.exports = {
  registerUser,
  listarUsuarios,
  obtenerUsuario,
  editarUsuario,
  eliminarUsuario,
  recuperarPassword,
  resetPassword,
  listarCursosPorUsuario,
  listarClasesPorUsuario,
};
