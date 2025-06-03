import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // <-- Importa Link

function MisCursosAlumno({ user }) {
  const [cursos, setCursos] = useState([]);
  const [cursoExpandido, setCursoExpandido] = useState(null);
  const [clasesPorCurso, setClasesPorCurso] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Trae los cursos donde el alumno está inscrito
  const fetchCursos = async () => {
    setMensaje("");
    if (!user || !user.id) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/usuarios/${user.id}/cursos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCursos(res.data);
    } catch {
      setError("Error al cargar tus cursos.");
    }
  };

  // Trae las clases de un curso específico
  const fetchClasesPorCurso = async (cursoId) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/cursos/${cursoId}/clases`,
        {
          headers: { Authorization: `Bearer ${token}` },
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

  // Elimina inscripción del alumno al curso
  const handleDesinscribirme = async (cursoId) => {
    setMensaje("");
    if (!window.confirm("¿Seguro que deseas desinscribirte de este curso?")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/cursos/${cursoId}/inscribir`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { alumnoId: user.id },
        }
      );
      setMensaje("✅ Te has desinscrito correctamente del curso.");
      fetchCursos(); // Refresca lista de cursos
      setCursoExpandido(null); // Cierra clases
    } catch (err) {
      setMensaje("❌ Error al desinscribirse del curso.");
    }
  };

  useEffect(() => {
    fetchCursos();
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📚 Mis Cursos Inscritos</h2>
      {mensaje && <p className="text-center font-semibold mb-4">{mensaje}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {cursos.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No estás inscrito en ningún curso.
          </div>
        )}
        {cursos.map((curso) => (
          <div
            key={curso.id}
            className="bg-white p-4 rounded shadow border border-gray-200"
          >
            <h3 className="text-xl font-semibold">{curso.nombre}</h3>
            <p className="text-gray-600">{curso.descripcion}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() =>
                  cursoExpandido === curso.id
                    ? setCursoExpandido(null)
                    : fetchClasesPorCurso(curso.id)
                }
                className="mt-3 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                {cursoExpandido === curso.id ? "Ocultar Clases" : "Ver Clases"}
              </button>
              <button
                onClick={() => handleDesinscribirme(curso.id)}
                className="ml-2 mt-3 bg-red-300 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Desinscribirme
              </button>
            </div>
            {cursoExpandido === curso.id && (
              <div className="mt-4">
                <h4 className="font-bold text-sm mb-2 text-indigo-600">
                  Clases de este curso:
                </h4>
                <ul className="text-sm list-disc list-inside mb-3">
                  {(clasesPorCurso[curso.id] || []).length === 0 ? (
                    <li className="text-gray-500">Este curso no tiene clases.</li>
                  ) : (
                    clasesPorCurso[curso.id].map((clase) => (
                      <li key={clase.id} className="mb-4">
                        <div>
                          <span className="font-medium">{clase.titulo}</span>
                          <span className="ml-2 text-gray-600">
                            ({clase.fecha} {clase.hora})
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mb-1">{clase.descripcion}</div>
                        {/* BOTÓN CORREGIDO: */}
                        
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MisCursosAlumno;

