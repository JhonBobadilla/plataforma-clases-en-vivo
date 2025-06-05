import { useState } from "react";
import SidebarAlumno from "./SidebarAlumno";
import PanelControlAlumno from "./alumno/PanelControlAlumno";
import MisCursosAlumno from "./alumno/MisCursosAlumno";
import CursosDisponiblesAlumno from "./alumno/CursosDisponiblesAlumno";
import MisClasesAlumno from "./alumno/MisClasesAlumno";

function DashboardAlumno({ user, onLogout }) {
  const [seccion, setSeccion] = useState("mis_cursos");

  return (
    <div className="flex min-h-screen bg-gray-200 relative">
      {/* Sidebar fijo */}
      <SidebarAlumno setSeccion={setSeccion} />

      {/* Datos usuario logueado */}
      <div className="absolute right-4 top-4 text-right px-4 py-2 z-50">
        <div className="font-bold text-lg text-indigo-600">{user?.nombre}</div>
        <div className="text-sm text-indigo-600">{user?.email}</div>
        <div className="text-sm capitalize text-indigo-600">{user?.rol}</div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {seccion === "mis_cursos" && (
          <MisCursosAlumno user={user} />
        )}
        {seccion === "cursos_disponibles" && (
          <CursosDisponiblesAlumno user={user} />
        )}
        {seccion === "panel_control" && (
          <PanelControlAlumno user={user} onLogout={onLogout} />
        )}
        {seccion === "proximas_clases" && (
          <MisClasesAlumno user={user} />
        )}
      </div>
    </div>
  );
}

export default DashboardAlumno;



