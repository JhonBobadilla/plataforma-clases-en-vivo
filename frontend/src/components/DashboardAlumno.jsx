import { useState } from "react";
import SidebarAlumno from "./SidebarAlumno";
import PanelControlAlumno from "./alumno/PanelControlAlumno";
import MisCursosAlumno from "./alumno/MisCursosAlumno";
import CursosDisponiblesAlumno from "./alumno/CursosDisponiblesAlumno"; // <-- Nuevo componente

function DashboardAlumno({ user, onLogout }) {
  const [seccion, setSeccion] = useState("mis_cursos");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fijo */}
      <SidebarAlumno setSeccion={setSeccion} />

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
      </div>
    </div>
  );
}

export default DashboardAlumno;

