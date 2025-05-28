import SidebarProfesor from "./SidebarProfesor";
import { useState } from "react";
import Cursos from "./profesor/Cursos";
import Clases from "./profesor/Clases";
import PanelControl from "./profesor/PanelControl"; // Asegúrate de la ruta

function DashboardProfesor({ user, onLogout }) {
  const [seccion, setSeccion] = useState("cursos");

  return (
    <div className="flex h-screen">
      <SidebarProfesor setSeccion={setSeccion} />

      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
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


