import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Dashboard({ user, onLogout }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500">
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
        <Route
          path="/"
          element={
            !user ? (
              <Login onLogin={setUser} />
            ) : (
              <Dashboard user={user} onLogout={() => setUser(null)} />
            )
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
