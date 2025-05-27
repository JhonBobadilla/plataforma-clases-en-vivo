const User = require('../models/User');

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

module.exports = {
  registerUser,
  listarUsuarios,
  obtenerUsuario,
  editarUsuario,
  eliminarUsuario,
  users
};
