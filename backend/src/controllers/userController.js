const User = require('../models/User');
const { cursos } = require('./cursoController'); // Importa los cursos para relación
const { clases } = require('./claseController'); // Importa las clases para relación
const crypto = require('crypto');

const ROLES_PERMITIDOS = ['profesor', 'alumno'];
let users = [];

// Registrar usuario
const registerUser = (req, res) => {
  const { nombre, email, password, rol, telefono, pais, ciudad, edad } = req.body;

  if (
    !nombre ||
    !email ||
    !password ||
    !rol ||
    !telefono ||
    !pais ||
    !ciudad ||
    !edad
  ) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  if (!ROLES_PERMITIDOS.includes(rol)) {
    return res.status(400).json({ message: 'Rol no válido. Solo se permite: profesor o alumno.' });
  }

  if (typeof edad !== 'number' || edad < 10 || edad > 120) {
    return res.status(400).json({ message: 'Edad no válida. Debe ser un número entre 10 y 120.' });
  }

  const existe = users.find(u => u.email === email);
  if (existe) {
    return res.status(409).json({ message: 'El email ya está registrado.' });
  }

  const id = users.length + 1;
  const nuevoUsuario = new User({ id, nombre, email, password, rol, telefono, pais, ciudad, edad });
  users.push(nuevoUsuario);

  res.status(201).json({
    message: 'Usuario registrado correctamente',
    usuario: { id, nombre, email, rol, telefono, pais, ciudad, edad }
  });
};

// Listar usuarios (todos o por rol)
const listarUsuarios = (req, res) => {
  const { rol } = req.query;
  if (rol) {
    const filtrados = users.filter(u => u.rol === rol);
    return res.status(200).json(filtrados);
  }
  res.status(200).json(users);
};

// Obtener usuario por id
const obtenerUsuario = (req, res) => {
  const { id } = req.params;
  const usuario = users.find(u => u.id === parseInt(id));
  if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });
  res.status(200).json(usuario);
};

// Editar usuario
const editarUsuario = (req, res) => {
  const { id } = req.params;
  const { nombre, password, telefono, pais, ciudad, edad } = req.body;
  const usuario = users.find(u => u.id === parseInt(id));
  if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });
  if (nombre) usuario.nombre = nombre;
  if (password) usuario.password = password;
  if (telefono) usuario.telefono = telefono;
  if (pais) usuario.pais = pais;
  if (ciudad) usuario.ciudad = ciudad;
  if (edad) usuario.edad = edad;
  res.status(200).json({ message: 'Usuario actualizado correctamente.', usuario });
};

// Eliminar usuario
const eliminarUsuario = (req, res) => {
  const { id } = req.params;
  const idx = users.findIndex(u => u.id === parseInt(id));
  if (idx === -1) return res.status(404).json({ message: 'Usuario no encontrado.' });
  users.splice(idx, 1);
  res.status(200).json({ message: 'Usuario eliminado correctamente.' });
};

/**
 * Recuperar contraseña - Simula envío de correo devolviendo el token por respuesta
 * POST /api/usuarios/recuperar-password
 */
const recuperarPassword = (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email es obligatorio.' });
  }
  const usuario = users.find(u => u.email === email);
  // Responde igual para no revelar existencia
  if (!usuario) {
    return res.status(200).json({ message: 'Si el usuario existe, se ha enviado un correo de recuperación (simulado).' });
  }
  // Genera token temporal y expiración (15 minutos)
  const token = crypto.randomBytes(20).toString('hex');
  usuario.resetToken = token;
  usuario.resetTokenExp = Date.now() + 15 * 60 * 1000;
  // En un sistema real, aquí enviarías el correo
  res.status(200).json({
    message: 'Si el usuario existe, se ha enviado un correo de recuperación (simulado).',
    resetToken: token // Solo para pruebas, en real nunca lo devuelvas así
  });
};

/**
 * Restablecer contraseña usando token temporal
 * POST /api/usuarios/reset-password
 */
const resetPassword = (req, res) => {
  const { token, nuevaPassword } = req.body;
  if (!token || !nuevaPassword) {
    return res.status(400).json({ message: 'Token y nueva contraseña son obligatorios.' });
  }
  const usuario = users.find(u => u.resetToken === token && u.resetTokenExp > Date.now());
  if (!usuario) {
    return res.status(400).json({ message: 'Token inválido o expirado.' });
  }
  usuario.password = nuevaPassword;
  delete usuario.resetToken;
  delete usuario.resetTokenExp;
  res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
};

/**
 * FILTRO AVANZADO: Listar cursos por usuario (profesor o alumno)
 * GET /api/usuarios/:id/cursos
 *  - Si es profesor: cursos que creó
 *  - Si es alumno: cursos donde está inscrito
 */
const listarCursosPorUsuario = (req, res) => {
  const { id } = req.params;
  const usuario = users.find(u => u.id === parseInt(id));
  if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });

  if (usuario.rol === 'profesor') {
    // Retorna cursos creados por el profesor
    const cursosCreados = cursos.filter(c => c.profesorId === usuario.id);
    return res.status(200).json(cursosCreados);
  } else if (usuario.rol === 'alumno') {
    // Retorna cursos donde está inscrito
    const cursosInscrito = cursos.filter(c => c.alumnos && c.alumnos.includes(usuario.id));
    return res.status(200).json(cursosInscrito);
  } else {
    return res.status(400).json({ message: 'Rol de usuario inválido.' });
  }
};

/**
 * FILTRO AVANZADO: Listar clases por usuario/alumno
 * GET /api/usuarios/:id/clases
 *  - Retorna clases donde está inscrito (participantes)
 */
const listarClasesPorUsuario = (req, res) => {
  const { id } = req.params;
  const usuario = users.find(u => u.id === parseInt(id));
  if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });

  const clasesInscrito = clases.filter(cl => cl.participantes && cl.participantes.includes(usuario.id));
  return res.status(200).json(clasesInscrito);
};

module.exports = {
  registerUser,
  listarUsuarios,
  obtenerUsuario,
  editarUsuario,
  eliminarUsuario,
  recuperarPassword,
  resetPassword,
  listarCursosPorUsuario,  // <-- NUEVO
  listarClasesPorUsuario,  // <-- NUEVO
  users
};



