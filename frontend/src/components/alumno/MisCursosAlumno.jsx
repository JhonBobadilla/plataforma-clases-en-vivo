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

  // Saber si la clase terminó hace 2 horas o más (mostrar chulo solo si han pasado 2h del inicio)
  function claseTerminada(clase) {
    if (!clase.fecha || !clase.hora) return false;
    const fechaHoraStr =
      clase.fecha.length > 10
        ? clase.fecha.substring(0, 10)
        : clase.fecha;
    const [ano, mes, dia] = fechaHoraStr.split("-");
    const [hora, minutos] = clase.hora.split(":");
    const fechaClase = new Date(
      Number(ano),
      Number(mes) - 1,
      Number(dia),
      Number(hora),
      Number(minutos)
    );
    const ahora = new Date();
    // Chulo aparece solo si han pasado 2h o más desde el inicio
    return ahora.getTime() >= fechaClase.getTime() + 2 * 60 * 60 * 1000;
  }

  // Saber si ya puede entrar (desde 24h antes hasta 2h después de iniciada la clase)
  function puedeEntrar(clase) {
    if (!clase.fecha || !clase.hora) return false;
    const fechaHoraStr =
      clase.fecha.length > 10
        ? clase.fecha.substring(0, 10)
        : clase.fecha;
    const [ano, mes, dia] = fechaHoraStr.split("-");
    const [hora, minutos] = clase.hora.split(":");
    const fechaClase = new Date(
      Number(ano),
      Number(mes) - 1,
      Number(dia),
      Number(hora),
      Number(minutos)
    );
    const ahora = new Date();
    const msAntes = fechaClase.getTime() - ahora.getTime(); // < 0 si ya inició
    const msDespues = ahora.getTime() - fechaClase.getTime(); // >= 0 si ya inició
    // Puedes entrar si falta menos de 24h y han pasado menos de 2h desde el inicio
    return msAntes <= 24 * 60 * 60 * 1000 && msDespues < 2 * 60 * 60 * 1000 && msAntes < 2 * 60 * 60 * 1000;
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
                  clasesPorCurso[curso.id].map((clase) => {
                    const terminada = claseTerminada(clase);
                    const mostrarEntrar = !terminada && puedeEntrar(clase);
                    return (
                      <li
                        key={clase.id}
                        className={`mb-4 flex flex-col sm:flex-row sm:items-center justify-between ${
                          terminada ? "bg-blue-100 rounded px-2 py-1" : ""
                        }`}
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
                        {/* Chulito SOLO si ya pasaron 2h del inicio, si no, botón */}
                        {terminada ? (
                          <span className="text-green-500 text-lg ml-3">✅</span>
                        ) : mostrarEntrar ? (
                          <Link
                            to={`/videollamada/${encodeURIComponent(
                              clase.titulo.replace(/\s+/g, "") + "-" + clase.id
                            )}`}
                            className="mt-1 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs text-center"
                          >
                            Entrar a clase
                          </Link>
                        ) : null}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
            {/* Botón Desinscribirme ABAJO */}
            <span
              onClick={() => handleDesinscribirme(curso.id)}
              className="w-left text-red-300 py-1 rounded text-sm cursor-pointer"
            >
              Eliminarme del curso
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MisCursosAlumno;

