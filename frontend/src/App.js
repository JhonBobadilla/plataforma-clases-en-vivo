import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardProfesor from "./components/DashboardProfesor";

function DashboardAlumno({ user, onLogout }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-500">
      <h1 className="text-4xl font-bold mb-4">
        Bienvenido, {user.nombre || user.email}!
      </h1>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded font-bold"
        onClick={() => {
          localStorage.removeItem("token");
          onLogout();
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

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
              <DashboardProfesor user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Panel Alumno provisional */}
        <Route
          path="/dashboard-alumno"
          element={
            user && user.rol === "alumno" ? (
              <DashboardAlumno user={user} onLogout={() => setUser(null)} />
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

