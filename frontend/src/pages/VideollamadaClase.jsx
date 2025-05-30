import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LiveKitMeet from "../components/LiveKitMeet";

function VideollamadaClase({ user }) {
  const { room } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Crea un userId único para LiveKit: profesor-5, alumno-8, etc.
  const liveKitIdentity =
    user && user.rol && user.id
      ? `${user.rol}-${user.id}`
      : `usuario-desconocido-${Date.now()}`;

  // Cuando termina la videollamada, regresar al dashboard
  const handleEnd = () => {
    navigate(user.rol === "profesor" ? "/dashboard-profesor" : "/dashboard-alumno");
  };

  useEffect(() => {
    const getToken = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.post("http://localhost:3000/api/livekit/token", {
          userId: liveKitIdentity,
          userName: user.nombre || user.displayName || liveKitIdentity,
          roomName: room,
        });
        setToken(res.data.token);
      } catch (err) {
        setError("Error al obtener el token de videollamada.");
      } finally {
        setLoading(false);
      }
    };
    if (user && room) getToken();
  }, [user, room, liveKitIdentity]);

  if (loading) return <div className="text-center mt-16 text-lg">Cargando videollamada...</div>;
  if (error) return <div className="text-center mt-16 text-red-600">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">
        Videollamada - Sala: {room}
      </h1>
      <LiveKitMeet roomName={room} token={token} onLeave={handleEnd} />
      <button
        onClick={handleEnd}
        className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow"
      >
        Salir de la videollamada
      </button>
    </div>
  );
}

export default VideollamadaClase;



