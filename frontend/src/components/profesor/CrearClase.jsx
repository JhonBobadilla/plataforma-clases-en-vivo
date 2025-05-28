import { useState } from "react";
import axios from "axios";

function CrearClase({ cursoId, profesorId, onClaseCreada }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [mensaje, setMensaje] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!cursoId || !profesorId) {
      setMensaje("Faltan datos necesarios.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/clases",
        {
          titulo,
          descripcion,
          fecha,
          hora,
          cursoId,
          profesorId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitulo("");
      setDescripcion("");
      setFecha("");
      setHora("");
      setMensaje("✅ Clase creada");
      if (onClaseCreada) onClaseCreada();
    } catch (err) {
      console.error("Error al crear clase:", err);
      setMensaje("❌ Error al crear clase");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded border mt-4">
      <h5 className="font-bold mb-2 text-sm">➕ Crear nueva clase</h5>
      {mensaje && <p className="text-sm mb-2 text-center">{mensaje}</p>}

      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full mb-2 p-2 border rounded text-sm"
        required
      />

      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full mb-2 p-2 border rounded text-sm"
        required
      />

      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="w-full mb-2 p-2 border rounded text-sm"
        required
      />
      <input
        type="time"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
        className="w-full mb-2 p-2 border rounded text-sm"
        required
      />

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-bold"
      >
        Crear clase
      </button>
    </form>
  );
}

export default CrearClase;


