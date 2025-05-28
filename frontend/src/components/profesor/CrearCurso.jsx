import { useState } from "react";
import axios from "axios";

function CrearCurso({ user, onCursoCreado }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/cursos",
        {
          nombre,
          descripcion,
          profesorId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje("Curso creado correctamente ✅");
      setNombre("");
      setDescripcion("");

      if (onCursoCreado) onCursoCreado(res.data.curso); // Notifica al padre
    } catch (err) {
      setMensaje("❌ Error al crear el curso.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md max-w-md mx-auto mb-6"
    >
      <h3 className="text-xl font-bold mb-4">➕ Crear nuevo curso</h3>
      {mensaje && <p className="mb-2 text-sm text-center">{mensaje}</p>}

      <input
        type="text"
        placeholder="Nombre del curso"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <textarea
        placeholder="Descripción del curso"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-bold"
      >
        Crear curso
      </button>
    </form>
  );
}

export default CrearCurso;
