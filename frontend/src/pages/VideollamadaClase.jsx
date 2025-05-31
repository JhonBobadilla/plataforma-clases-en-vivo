import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LiveKitMeet from "../components/LiveKitMeet";
import Whiteboard from "../components/Whiteboard";

function VideollamadaClase({ user }) {
  const { room } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const liveKitIdentity =
    user && user.rol && user.id
      ? `${user.rol}-${user.id}`
      : `usuario-desconocido-${Date.now()}`;

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

  if (loading) return <div className="text-center mt-16 text-lg text-white">Cargando videollamada...</div>;
  if (error) return <div className="text-center mt-16 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-black p-4 relative text-white">
      {/* Botón salir arriba a la derecha */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}>
        <button
          onClick={handleEnd}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow"
        >
          Salir de la videollamada
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-indigo-400 text-center">
        Videollamada - Sala: {room}
      </h1>

      <div className="flex gap-4 h-[calc(100vh-120px)]">
        {/* Video: 60% ancho */}
        <div className="w-4/5 bg-black rounded-lg shadow-md p-2">
          <LiveKitMeet roomName={room} token={token} onLeave={handleEnd} />
        </div>

        {/* Tablero: 40% ancho */}
        <div className="w-1/5 bg-[#0f172a] rounded-lg shadow-md p-2 flex flex-col h-full">
          <Whiteboard style={{ flexGrow: 1, height: "100%" }} />
        </div>
      </div>
    </div>
  );
}

export default VideollamadaClase;

