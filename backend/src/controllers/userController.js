const User = require('../models/User');

const ROLES_PERMITIDOS = ['profesor', 'alumno'];

let users = [];

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

module.exports = { registerUser, users };

