const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_ultrasecreto';

// Middleware para verificar el token JWT
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user; // El usuario autenticado queda disponible en req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

// Middleware para validar rol específico
function requireRole(role) {
  return function (req, res, next) {
    if (!req.user || req.user.rol !== role) {
      return res.status(403).json({ message: `Acceso denegado. Se requiere rol: ${role}.` });
    }
    next();
  };
}

module.exports = { verificarToken, requireRole };

