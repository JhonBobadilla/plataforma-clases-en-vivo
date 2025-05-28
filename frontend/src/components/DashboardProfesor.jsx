import SidebarProfesor from "./SidebarProfesor";
import { useState } from "react";
import Cursos from "./profesor/Cursos"; // Provisional, aún no existe
import Clases from "./profesor/Clases"; // Provisional, aún no existe

function DashboardProfesor({ user }) {
  const [seccion, setSeccion] = useState("cursos");

  return (
    <div className="flex h-screen">
      <SidebarProfesor setSeccion={setSeccion} />

      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {seccion === "cursos" && <Cursos user={user} />}
        {seccion === "clases" && <Clases user={user} />}
      </div>
    </div>
  );
}

export default DashboardProfesor;
