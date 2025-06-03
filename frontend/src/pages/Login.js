import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  console.log("Componente Login cargó"); // Para saber que el componente está en uso

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Se ejecuta handleSubmit");
    // Usar variable de entorno para la URL del backend
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
    console.log("API URL:", API_URL);
    console.log("Intentando login en:", `${API_URL}/api/auth/login`);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      console.log("Respuesta del backend:", response);
      console.log("Datos recibidos:", data);

      if (!response.ok) {
        setError(data.message || "Error al iniciar sesión");
        console.log("Error de autenticación:", data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      if (onLogin) onLogin(data.usuario);
      console.log("Login exitoso:", data.usuario);
    } catch (err) {
      setError("Error al conectar al servidor");
      console.log("Error al conectar al servidor:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        {error && <p className="mb-3 text-red-600">{error}</p>}
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 p-2 w-full border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 p-2 w-full border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition"
        >
          Entrar
        </button>
        <button
          type="button"
          className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-blue-700 py-2 rounded font-bold transition"
          onClick={() => navigate("/register")}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Login;


