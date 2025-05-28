import { useEffect, useState } from "react";
import axios from "axios";
import CrearCurso from "./CrearCurso";
import CrearClase from "./CrearClase";

function Cursos({ user }) {
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState("");
  const [clasesPorCurso, setClasesPorCurso] = useState({});
  const [cursoExpandido, setCursoExpandido] = useState(null);

  const token = localStorage.getItem("token");

  const fetchCursos = async () => {
    if (!user || !user.id) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/usuarios/${user.id}/cursos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCursos(res.data);
    } catch (err) {
      setError("Error al cargar los cursos.");
    }
  };

  const fetchClasesPorCurso = async (cursoId) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/cursos/${cursoId}/clases`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClasesPorCurso((prev) => ({
        ...prev,
        [cursoId]: res.data,
      }));
      setCursoExpandido(cursoId);
    } catch {
      alert("Error al cargar las clases.");
    }
  };

  const handleCursoCreado = () => {
    fetchCursos();
  };

  const handleClaseCreada = (cursoId) => {
    fetchClasesPorCurso(cursoId);
  };

  useEffect(() => {
    if (user && user.id) {
      fetchCursos();
    }
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📘 Mis Cursos</h2>
      {error && <p className="text-red-600">{error}</p>}

      <CrearCurso user={user} onCursoCreado={handleCursoCreado} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {cursos.map((curso) => (
          <div
            key={curso.id}
            className="bg-white p-4 rounded shadow border border-gray-200"
          >
            <h3 className="text-xl font-semibold">{curso.nombre}</h3>
            <p className="text-gray-600">{curso.descripcion}</p>

            <button
              onClick={() => fetchClasesPorCurso(curso.id)}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              Clases
            </button>

            {cursoExpandido === curso.id && (
              <div className="mt-4">
                <h4 className="font-bold text-sm mb-2 text-indigo-600">
                  Clases de este curso:
                </h4>
                <ul className="text-sm list-disc list-inside">
                  {(clasesPorCurso[curso.id] || []).map((clase) => (
                    <li key={clase.id}>
                      <span className="font-medium">{clase.titulo}</span> ({clase.fecha} {clase.hora})
                    </li>
                  ))}
                </ul>
                <CrearClase
                  cursoId={curso.id}
                  profesorId={user.id}
                  onClaseCreada={() => handleClaseCreada(curso.id)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cursos;


