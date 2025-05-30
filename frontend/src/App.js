import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardProfesor from "./components/DashboardProfesor";
import DashboardAlumno from "./components/DashboardAlumno";
import VideollamadaClase from "./pages/VideollamadaClase"; // <-- Importa la nueva página de videollamada

function App() {
  const [user, setUser] = useState(null);

  // Función de logout (puedes moverla a donde prefieras)
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Página raíz: Login o redirección según el rol */}
        <Route
          path="/"
          element={
            !user ? (
              <Login onLogin={setUser} />
            ) : user.rol === "profesor" ? (
              <Navigate to="/dashboard-profesor" />
            ) : (
              <Navigate to="/dashboard-alumno" />
            )
          }
        />

        {/* Registro */}
        <Route path="/register" element={<Register />} />

        {/* Panel Profesor */}
        <Route
          path="/dashboard-profesor"
          element={
            user && user.rol === "profesor" ? (
              <DashboardProfesor user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Panel Alumno (real, con sidebar, cursos y clases) */}
        <Route
          path="/dashboard-alumno"
          element={
            user && user.rol === "alumno" ? (
              <DashboardAlumno user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Videollamada de clase - Jitsi */}
        <Route
          path="/videollamada/:room"
          element={
            user ? (
              <VideollamadaClase user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
