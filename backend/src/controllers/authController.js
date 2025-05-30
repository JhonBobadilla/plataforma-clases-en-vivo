const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const SECRET_KEY = 'supersecreto123'; // En producción usa process.env.SECRET_KEY

// Login de usuario
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y password son obligatorios.' });
  }
console.log('Intentando login para:', email);
  try {
    // Busca el usuario en la base de datos
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const user = result.rows[0];

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
  } catch (err) {
    console.error('LOGIN ERROR:', err); 
    return res.status(500).json({ message: 'Error en el login', error: err.message });
}
};

module.exports = { loginUser };


