import { useEffect, useState } from "react";
import axios from "axios";
import CrearCurso from "./CrearCurso";
import CrearClase from "./CrearClase";
import { Link } from "react-router-dom";

function Cursos({ user }) {
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState("");
  const [clasesPorCurso, setClasesPorCurso] = useState({});
  const [editandoClaseId, setEditandoClaseId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editandoCursoId, setEditandoCursoId] = useState(null);
  const [editCursoForm, setEditCursoForm] = useState({});
  const [mostrarCrearClase, setMostrarCrearClase] = useState({});

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
    } catch {
      alert("Error al cargar las clases.");
    }
  };

  const handleCursoCreado = () => {
    fetchCursos();
  };

  const handleClaseCreada = (cursoId) => {
    fetchClasesPorCurso(cursoId);
    setMostrarCrearClase((prev) => ({ ...prev, [cursoId]: false }));
  };

  // ----------- CRUD CLASES --------------
  const startEdit = (clase) => {
    setEditandoClaseId(clase.id);
    setEditForm({
      titulo: clase.titulo,
      descripcion: clase.descripcion,
      fecha: clase.fecha,
      hora: clase.hora,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (claseId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/clases/${claseId}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditandoClaseId(null);
      const cursoId = Object.keys(clasesPorCurso).find(cid =>
        (clasesPorCurso[cid] || []).some(c => c.id === claseId)
      );
      if (cursoId) fetchClasesPorCurso(cursoId);
    } catch {
      alert("❌ Error al actualizar la clase");
    }
  };

  const eliminarClase = async (claseId) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta clase?")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/clases/${claseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const cursoId = Object.keys(clasesPorCurso).find(cid =>
        (clasesPorCurso[cid] || []).some(c => c.id === claseId)
      );
      if (cursoId) fetchClasesPorCurso(cursoId);
    } catch {
      alert("❌ Error al eliminar la clase");
    }
  };

  // ----------- CRUD CURSOS --------------
  const startEditCurso = (curso) => {
    setEditandoCursoId(curso.id);
    setEditCursoForm({
      nombre: curso.nombre,
      descripcion: curso.descripcion,
    });
  };

  const handleEditCursoChange = (e) => {
    const { name, value } = e.target;
    setEditCursoForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEditCurso = async (cursoId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/cursos/${cursoId}`,
        editCursoForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditandoCursoId(null);
      fetchCursos();
    } catch {
      alert("❌ Error al actualizar el curso");
    }
  };

  const eliminarCurso = async (cursoId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este curso? (Se eliminarán también las clases)")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/cursos/${cursoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCursos();
      setClasesPorCurso((prev) => {
        const nuevo = { ...prev };
        delete nuevo[cursoId];
        return nuevo;
      });
      setMostrarCrearClase((prev) => {
        const nuevo = { ...prev };
        delete nuevo[cursoId];
        return nuevo;
      });
    } catch {
      alert("❌ Error al eliminar el curso");
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchCursos();
    }
  }, [user]);

  useEffect(() => {
    cursos.forEach((curso) => {
      fetchClasesPorCurso(curso.id);
    });
    // eslint-disable-next-line
  }, [cursos]);

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

  // Mostrar chulo 22 horas después de iniciada la clase
  function mostrarChulo22hDespues(clase) {
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
    // ✅ Aparece solo si han pasado 1h o más desde el inicio de la clase
    return ahora.getTime() >= fechaClase.getTime() + 1 * 60 * 60 * 1000;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📘 Mis Cursos</h2>
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {cursos.map((curso) => (
          <div
            key={curso.id}
            className="bg-white p-4 rounded shadow border border-gray-200"
          >
            {editandoCursoId === curso.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEditCurso(curso.id);
                }}
                className="bg-gray-100 p-3 my-2 rounded"
              >
                <input
                  type="text"
                  name="nombre"
                  value={editCursoForm.nombre}
                  onChange={handleEditCursoChange}
                  placeholder="Nombre del curso"
                  className="w-full mb-2 p-1 border rounded text-sm"
                  required
                />
                <input
                  type="text"
                  name="descripcion"
                  value={editCursoForm.descripcion}
                  onChange={handleEditCursoChange}
                  placeholder="Descripción"
                  className="w-full mb-2 p-1 border rounded text-sm"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-black px-3 py-1 rounded text-sm"
                    onClick={() => setEditandoCursoId(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{curso.nombre}</h3>
                <p className="text-gray-600">{curso.descripcion}</p>

                {/* Lista de clases SIEMPRE visible */}
                <div className="mt-4">
                  <h4 className="font-bold text-sm mb-2 text-indigo-600">
                    Clases de este curso:
                  </h4>
                  <ul className="text-sm list-disc list-inside mb-3">
                    {(clasesPorCurso[curso.id] || []).map((clase) => {
                      const chulo = mostrarChulo22hDespues(clase);
                      return (
                        <li
                          key={clase.id}
                          className={`mb-2 flex flex-col sm:flex-row sm:items-center ${
                            chulo ? "bg-blue-100 rounded px-2 py-1" : ""
                          }`}
                        >
                          {/* Link para entrar a la clase */}
                          <Link
                            to={`/videollamada/${encodeURIComponent(
                              clase.titulo.replace(/\s+/g, "") + "-" + clase.id
                            )}`}
                            className="font-medium text-blue-600 cursor-pointer hover:underline"
                          >
                            {clase.titulo} ({formateaFechaHora(clase.fecha, clase.hora)})
                          </Link>
                          {/* Editar y eliminar clase o chulito */}
                          <div className="flex gap-3 ml-0 sm:ml-3 mt-1 sm:mt-0 items-center">
                            {chulo ? (
                              <span className="text-green-500 text-lg ml-2">✅</span>
                            ) : (
                              <>
                                <span
                                  onClick={() => startEdit(clase)}
                                  className="text-blue-500 cursor-pointer hover:underline text-xs"
                                >
                                  Editar
                                </span>
                                <span
                                  onClick={() => eliminarClase(clase.id)}
                                  className="text-red-500 cursor-pointer hover:underline text-xs"
                                >
                                  Eliminar
                                </span>
                              </>
                            )}
                          </div>
                          {/* Formulario de edición de clase */}
                          {editandoClaseId === clase.id && !chulo && (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                saveEdit(clase.id);
                              }}
                              className="bg-gray-100 p-3 mt-2 rounded"
                            >
                              <input
                                type="text"
                                name="titulo"
                                value={editForm.titulo}
                                onChange={handleEditChange}
                                placeholder="Título"
                                className="w-full mb-2 p-1 border rounded text-sm"
                                required
                              />
                              <input
                                type="text"
                                name="descripcion"
                                value={editForm.descripcion}
                                onChange={handleEditChange}
                                placeholder="Descripción"
                                className="w-full mb-2 p-1 border rounded text-sm"
                                required
                              />
                              <input
                                type="date"
                                name="fecha"
                                value={editForm.fecha}
                                onChange={handleEditChange}
                                className="w-full mb-2 p-1 border rounded text-sm"
                                required
                              />
                              <input
                                type="time"
                                name="hora"
                                value={editForm.hora}
                                onChange={handleEditChange}
                                className="w-full mb-2 p-1 border rounded text-sm"
                                required
                              />
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  className="bg-gray-300 text-black px-3 py-1 rounded text-sm"
                                  onClick={() => setEditandoClaseId(null)}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </form>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Botón para mostrar formulario CrearClase */}
                <button
                  onClick={() =>
                    setMostrarCrearClase((prev) => ({
                      ...prev,
                      [curso.id]: !prev[curso.id],
                    }))
                  }
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  Crear clases
                </button>

                {/* Formulario para crear clase SOLO si se dio clic en "Crear clases" */}
                {mostrarCrearClase[curso.id] && (
                  <CrearClase
                    cursoId={curso.id}
                    profesorId={user.id}
                    onClaseCreada={() => handleClaseCreada(curso.id)}
                  />
                )}

                {/* TEXTOS clickeables debajo de Crear clases */}
                <div className="flex flex-col items-start mt-2">
                  <span
                    onClick={() => startEditCurso(curso)}
                    className="mt-2 text-blue-500 cursor-pointer hover:underline text-sm"
                  >
                    Editar curso
                  </span>
                  <span
                    onClick={() => eliminarCurso(curso.id)}
                    className="mt-1 text-red-500 cursor-pointer hover:underline text-sm"
                  >
                    Eliminar curso
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Mueve el formulario de crear curso aquí, debajo del listado */}
      <div className="mt-10 max-w-md mx-auto">
        <CrearCurso user={user} onCursoCreado={handleCursoCreado} />
      </div>
    </div>
  );
}

export default Cursos;
