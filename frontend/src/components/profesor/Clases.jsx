import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Clases({ user }) {
  const [clases, setClases] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Trae TODOS los cursos (no solo los propios)
    const fetchCursos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/cursos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCursos(res.data); // <<--- Ahora trae todos los cursos
      } catch {
        setCursos([]);
      }
    };

    // Trae todas las clases
    const fetchClases = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/clases", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Solo clases del profesor
        const filtradas = res.data.filter(
          (clase) => clase.profesor_id === user.id
        );

        // ORDENAR por fecha + hora
        const ordenadas = filtradas.sort((a, b) => {
          const dateA = new Date(a.fecha.split('T')[0] + 'T' + a.hora);
          const dateB = new Date(b.fecha.split('T')[0] + 'T' + b.hora);
          return dateA - dateB;
        });

        setClases(ordenadas);
      } catch (err) {
        setError("Error al cargar las clases.");
      }
    };

    fetchCursos();
    fetchClases();
  }, [user.id, token]);

  // Buscar el nombre del curso para cada clase (ahora usando nombre)
  const getCursoTitulo = (curso_id) => {
    const curso = cursos.find((c) => c.id === curso_id);
    return curso ? curso.nombre : "Curso desconocido";
  };

  // Puedes quitar los console.log si ya no los necesitas

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📅 Próximas Clases</h2>
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clases.map((clase) => (
          <div
            key={clase.id}
            className="bg-white p-4 rounded shadow border border-gray-200"
          >
            {/* Mostrar el nombre del curso */}
            <div className="text-sm text-black mb-1 font-bold uppercase">
              {getCursoTitulo(clase.curso_id)}
            </div>
            <h3 className="text-xl font-semibold">{clase.titulo}</h3>
            <p className="text-gray-600">{clase.descripcion}</p>
            <p className="text-sm text-gray-500">
              {clase.fecha} – {clase.hora}
            </p>
            <Link
              to={`/videollamada/${encodeURIComponent(
                (clase.titulo.replace(/\s+/g, "") + "-" + clase.id)
              )}`}
              className="inline-block ml-auto mt-3 bg-blue-300 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm text-center"
            >
              Entrar a la clase
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clases;

