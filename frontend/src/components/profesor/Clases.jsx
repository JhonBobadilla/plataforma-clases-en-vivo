import { useEffect, useState } from "react";
import axios from "axios";

function Clases({ user }) {
  const [clases, setClases] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/clases", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Solo clases del profesor
        const filtradas = res.data.filter(
          (clase) => clase.profesor_id === user.id
        );
        setClases(filtradas);
      } catch (err) {
        setError("Error al cargar las clases.");
      }
    };

    fetchClases();
  }, [user.id, token]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📗 Mis Clases</h2>
      {error && <p className="text-red-600">{error}</p>}

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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clases;
