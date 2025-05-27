class Clase {
  constructor({ id, titulo, descripcion, fecha, hora, profesorId, cursoId, participantes }) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.hora = hora;
    this.profesorId = profesorId;
    this.cursoId = cursoId; // Relación con el curso
    this.participantes = participantes || [];
  }
}

module.exports = Clase;

