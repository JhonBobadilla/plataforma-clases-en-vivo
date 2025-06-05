import SidebarProfesor from "./SidebarProfesor";
import { useState } from "react";
import Cursos from "./profesor/Cursos";
import Clases from "./profesor/Clases";
import PanelControl from "./profesor/PanelControl"; // Asegúrate de la ruta

function DashboardProfesor({ user, onLogout }) {
  const [seccion, setSeccion] = useState("cursos");

  return (
    <div className="flex min-h-screen bg-gray-200 relative">
      <SidebarProfesor setSeccion={setSeccion} />

      {/* Datos usuario logueado */}
      <div className="absolute right-4 top-2 text-right px-4 py-2 z-50">
      <div className="font-bold text-lg text-indigo-600">{user?.nombre}</div>
      <div className="text-sm text-indigo-600">{user?.email}</div>
      <div className="text-sm capitalize text-indigo-600">{user?.rol}</div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {seccion === "cursos" && <Cursos user={user} />}
        {seccion === "clases" && <Clases user={user} />}
        {seccion === "panel_control" && (
          <PanelControl user={user} onLogout={onLogout} />
        )}
      </div>
    </div>
  );
}

export default DashboardProfesor;



