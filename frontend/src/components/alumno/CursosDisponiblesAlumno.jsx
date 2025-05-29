import { useEffect, useState } from "react";
import axios from "axios";

function CursosDisponiblesAlumno({ user }) {
  const [cursos, setCursos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Trae todos los cursos a los que NO está inscrito el alumno
  const fetchCursosDisponibles = async () => {
    setMensaje("");
    if (!user || !user.id) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/cursos`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Filtra para mostrar solo los que NO está inscrito (asume que user.cursosInscritos o hay que consultar)
      const resCursosInscritos = await axios.get(
        `http://localhost:3000/api/usuarios/${user.id}/cursos`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const idsInscritos = new Set(resCursosInscritos.data.map(c => c.id));
      const cursosNoInscritos = res.data.filter(curso => !idsInscritos.has(curso.id));
      setCursos(cursosNoInscritos);
    } catch {
      setError("Error al cargar cursos disponibles.");
    }
  };

  // Inscribir alumno al curso
  const handleInscribirme = async (cursoId) => {
    setMensaje("");
    try {
      await axios.post(
        `http://localhost:3000/api/cursos/${cursoId}/inscribir`,
        { alumnoId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("✅ Inscripción exitosa. Ya puedes ver el curso en 'Mis Cursos'.");
      // Recarga los cursos disponibles para quitar el inscrito de la lista
      fetchCursosDisponibles();
    } catch (err) {
      setMensaje("❌ Error al inscribirse en el curso.");
    }
  };

  useEffect(() => {
    fetchCursosDisponibles();
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🆕 Cursos Disponibles</h2>
      {mensaje && <p className="text-center font-semibold mb-4">{mensaje}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {cursos.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No hay cursos disponibles para inscribirse.
          </div>
        ) : (
          cursos.map((curso) => (
            <div
              key={curso.id}
              className="bg-white p-4 rounded shadow border border-gray-200"
            >
              <h3 className="text-xl font-semibold">{curso.nombre}</h3>
              <p className="text-gray-600 mb-2">{curso.descripcion}</p>
              <button
                onClick={() => handleInscribirme(curso.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-bold"
              >
                Inscribirme
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CursosDisponiblesAlumno;
