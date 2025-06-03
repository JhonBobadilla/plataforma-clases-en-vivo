import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MisCursosAlumno({ user }) {
  const [cursos, setCursos] = useState([]);
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

  // Trae las clases de todos los cursos una vez (para que siempre estén listadas)
  const fetchClasesTodosCursos = async (listaCursos) => {
    for (const curso of listaCursos) {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/cursos/${curso.id}/clases`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setClasesPorCurso((prev) => ({
          ...prev,
          [curso.id]: res.data,
        }));
      } catch {
        // Opcional: manejo de error individual
      }
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
      fetchCursos();
      setClasesPorCurso((prev) => {
        const nuevo = { ...prev };
        delete nuevo[cursoId];
        return nuevo;
      });
    } catch (err) {
      setMensaje("❌ Error al desinscribirse del curso.");
    }
  };

  // Formateador simple de fecha y hora
  function formateaFechaHora(fecha, hora) {
    let fechaStr = fecha;
    let horaStr = hora;
    try {
      if (fecha && fecha.includes("T")) {
        const d = new Date(fecha);
        fechaStr = d.toLocaleDateString();
      }
      if (hora && hora.length > 5) {
        horaStr = hora.substring(0, 5);
      }
    } catch {}
    return `${fechaStr} ${horaStr}`;
  }

  useEffect(() => {
    fetchCursos();
    // eslint-disable-next-line
  }, [user]);

  // Cada vez que se cargan los cursos, se traen las clases de todos los cursos
  useEffect(() => {
    if (cursos.length > 0) {
      fetchClasesTodosCursos(cursos);
    }
    // eslint-disable-next-line
  }, [cursos]);

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
            <div className="mt-4">
              <h4 className="font-bold text-sm mb-2 text-indigo-600">
                Clases de este curso:
              </h4>
              <ul className="text-sm list-disc list-inside mb-3">
                {(clasesPorCurso[curso.id] || []).length === 0 ? (
                  <li className="text-gray-500">Este curso no tiene clases.</li>
                ) : (
                  clasesPorCurso[curso.id].map((clase) => (
                    <li
                      key={clase.id}
                      className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between"
                    >
                      <div>
                        <span className="font-medium">
                          {clase.titulo}
                        </span>
                        <span className="ml-2 text-gray-600">
                          ({formateaFechaHora(clase.fecha, clase.hora)})
                        </span>
                        <div className="text-xs text-gray-500 mb-1">
                          {clase.descripcion}
                        </div>
                      </div>
                      {/* Botón ENTRAR A CLASE */}
                      <Link
                        to={`/videollamada/${encodeURIComponent(clase.titulo.replace(/\s+/g, "") + "-" + clase.id)}`}
                        className="mt-1 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs text-center"
                      >
                        Entrar a clase
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
            {/* Botón Desinscribirme ABAJO */}
            <button
              onClick={() => handleDesinscribirme(curso.id)}
              className="w-full bg-red-300 hover:bg-red-700 text-white py-1 rounded text-sm">
              Eliminarme del curso
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MisCursosAlumno;



