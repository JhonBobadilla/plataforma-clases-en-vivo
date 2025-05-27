class User {
  constructor({ id, nombre, email, password, rol, telefono, pais, ciudad, edad }) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.rol = rol; // 'profesor' o 'alumno'
    this.telefono = telefono; 
    this.pais = pais;
    this.ciudad = ciudad;
    this.edad = edad;
  }
}

module.exports = User;

