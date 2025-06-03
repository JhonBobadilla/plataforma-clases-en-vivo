import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MisClasesAlumno({ user }) {
  const [clases, setClases] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClasesAlumno = async () => {
      try {
        // 1. Trae los cursos a los que el alumno está inscrito
        const cursosRes = await axios.get("http://localhost:3000/api/cursos/inscritos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cursosIds = cursosRes.data.map((curso) => Number(curso.id));
        // 2. Trae todas las clases
        const clasesRes = await axios.get("http://localhost:3000/api/clases", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // 3. Filtra las clases que pertenecen a los cursos inscritos
        const clasesFiltradas = clasesRes.data.filter((clase) =>
          cursosIds.includes(Number(clase.curso_id))
        );
        // 4. Solo clases futuras (opcional)
        const ahora = new Date();
        const clasesOrdenadas = clasesFiltradas
          .filter((clase) => {
            const fechaSolo = clase.fecha.split('T')[0];
            const claseDate = new Date(`${fechaSolo}T${clase.hora}`);
            return claseDate >= ahora;
          })
          .sort((a, b) => {
            const fechaA = a.fecha.split('T')[0];
            const fechaB = b.fecha.split('T')[0];
            const dateA = new Date(`${fechaA}T${a.hora}`);
            const dateB = new Date(`${fechaB}T${b.hora}`);
            return dateA - dateB;
          });

        setClases(clasesOrdenadas);
      } catch (err) {
        setError("Error al cargar las clases.");
        console.error(err);
      }
    };

    fetchClasesAlumno();
  }, [user.id, token]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📅 Próximas Clases</h2>
      {error && <p className="text-red-600">{error}</p>}

      {clases.length === 0 ? (
        <p>No hay próximas clases.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clases.map((clase) => (
            <div
              key={clase.id}
              className="bg-white p-4 rounded shadow border border-gray-200"
            >
              <h3 className="text-xl font-semibold">{clase.titulo}</h3>
              <p className="text-gray-600">{clase.descripcion}</p>
              <p className="text-sm text-gray-500">
                {clase.fecha} – {clase.hora}
              </p>
              <p className="text-sm text-blue-600 font-semibold">
                Curso: {clase.nombre_curso || clase.curso_id}
              </p>
              {/* BOTÓN ENTRAR A CLASE */}
              <Link
                to={`/videollamada/${encodeURIComponent(
                  (clase.titulo.replace(/\s+/g, "") + "-" + clase.id)
                )}`}
                className="block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm text-center"
              >
                Entrar a la clase
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisClasesAlumno;
