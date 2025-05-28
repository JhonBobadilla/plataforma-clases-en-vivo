import { useEffect, useState } from "react";
import axios from "axios";
import CrearCurso from "./CrearCurso";
import CrearClase from "./CrearClase";

function Cursos({ user }) {
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState("");
  const [clasesPorCurso, setClasesPorCurso] = useState({});
  const [cursoExpandido, setCursoExpandido] = useState(null);
  const [editandoClaseId, setEditandoClaseId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editandoCursoId, setEditandoCursoId] = useState(null);
  const [editCursoForm, setEditCursoForm] = useState({});

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
      fetchClasesPorCurso(cursoExpandido);
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
      fetchClasesPorCurso(cursoExpandido);
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
      if (cursoExpandido === cursoId) setCursoExpandido(null);
    } catch {
      alert("❌ Error al eliminar el curso");
    }
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {cursos.map((curso) => (
          <div
            key={curso.id}
            className="bg-white p-4 rounded shadow border border-gray-200"
          >
            {/* Formulario editar curso o botones de editar/eliminar */}
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
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => startEditCurso(curso)}
                    className="ml-2 mt-3 bg-blue-400 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Editar curso
                  </button>
                  <button
                    onClick={() => eliminarCurso(curso.id)}
                    className="ml-2 mt-3 bg-red-300 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Eliminar curso
                  </button>
                </div>
              </>
            )}

            <button
              onClick={() => fetchClasesPorCurso(curso.id)}
              className="mt-3 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              Clases
            </button>

            {cursoExpandido === curso.id && (
              <div className="mt-4">
                <h4 className="font-bold text-sm mb-2 text-indigo-600">
                  Clases de este curso:
                </h4>
                <ul className="text-sm list-disc list-inside mb-3">
                  {(clasesPorCurso[curso.id] || []).map((clase) => (
                    <li key={clase.id} className="mb-2">
                      <span className="font-medium">{clase.titulo}</span> ({clase.fecha} {clase.hora})
                      <button
                        onClick={() => startEdit(clase)}
                        className="ml-2 mt-3 bg-blue-400 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarClase(clase.id)}
                        className="ml-2 mt-3 bg-red-300 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Eliminar
                      </button>
                      {editandoClaseId === clase.id && (
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

      {/* Mueve el formulario de crear curso aquí, debajo del listado */}
      <div className="mt-10 max-w-md mx-auto">
        <CrearCurso user={user} onCursoCreado={handleCursoCreado} />
      </div>
    </div>
  );
}

export default Cursos;
