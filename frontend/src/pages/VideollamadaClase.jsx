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

  if (loading)
    return <div className="text-center mt-16 text-lg text-white">Cargando videollamada...</div>;
  if (error)
    return <div className="text-center mt-16 text-red-600">{error}</div>;

  return (
    <div className="flex flex-col w-screen h-screen bg-black">
      {/* HEADER */}
      <div className="w-full py-2 bg-black">
        <h1 className="text-2xl font-bold text-white text-center">
          Videollamada - Sala: {room}
        </h1>
      </div>
      {/* MAIN AREA */}
      <div className="flex flex-1 w-full h-full overflow-hidden">
        {/* VIDEOLLAMADA */}
        <div className="flex flex-col flex-1 bg-black p-2 pr-1">
          <div className="flex-1 bg-black rounded-lg shadow-md overflow-hidden flex">
            <LiveKitMeet roomName={room} token={token} onLeave={handleEnd} />
          </div>
        </div>
        {/* TABLERO */}
        <div className="flex flex-col w-[22vw] max-w-xs min-w-[500px] h-full bg-[#1e1e1e] rounded-lg shadow-md p-2 pl-1">
          <Whiteboard rol={user.rol} />

        </div>
      </div>
    </div>
  );
}

export default VideollamadaClase;

