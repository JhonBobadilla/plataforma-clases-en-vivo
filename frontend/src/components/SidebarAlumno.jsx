function SidebarAlumno({ setSeccion }) {
  return (
    <div className="w-64 bg-indigo-700 text-white flex flex-col">
      <div className="p-4 text-center text-2xl font-bold border-b border-indigo-500">
        Panel Alumno
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setSeccion("mis_cursos")}
              className="w-full text-left hover:bg-indigo-600 p-2 rounded"
            >
              📚 Mis Cursos
            </button>
          </li>
          <li>
            <button
              onClick={() => setSeccion("cursos_disponibles")}
              className="w-full text-left hover:bg-indigo-600 p-2 rounded"
            >
              🆕 Cursos Disponibles
            </button>
          </li>
          <li>
            <button
              onClick={() => setSeccion("proximas_clases")}
              className="w-full text-left hover:bg-indigo-600 p-2 rounded"
            >
              🗓️ Próximas Clases
            </button>
          </li>
          <li>
            <button
              onClick={() => setSeccion("panel_control")}
              className="w-full text-left hover:bg-indigo-600 p-2 rounded"
            >
              🛠️ Editar usuario
            </button>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-indigo-500 text-sm text-center">
        © 2025 JABL
      </div>
    </div>
  );
}

export default SidebarAlumno;



