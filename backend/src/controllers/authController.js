const jwt = require('jsonwebtoken');
const { users } = require('./userController');

const SECRET_KEY = 'supersecreto123'; // Cámbialo por variable de entorno en producción

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y password son obligatorios.' });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Credenciales incorrectas.' });
  }

  // Genera el token JWT
  const token = jwt.sign(
    {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      telefono: user.telefono,
      pais: user.pais,
      ciudad: user.ciudad,
      edad: user.edad
    },
    SECRET_KEY,
    { expiresIn: '8h' }
  );

  res.status(200).json({
    message: 'Login exitoso',
    token,
    usuario: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      telefono: user.telefono,
      pais: user.pais,
      ciudad: user.ciudad,
      edad: user.edad
    }
  });
};

module.exports = { loginUser };

