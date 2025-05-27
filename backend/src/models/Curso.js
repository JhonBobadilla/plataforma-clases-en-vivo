class Curso {
  constructor({ id, nombre, descripcion, profesorId, alumnos }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.profesorId = profesorId;
    this.alumnos = alumnos || [];
  }
}

module.exports = Curso;
