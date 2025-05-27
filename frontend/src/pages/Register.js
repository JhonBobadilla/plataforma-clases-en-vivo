import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [edad, setEdad] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !nombre ||
      !email ||
      !password ||
      !rol ||
      !telefono ||
      !pais ||
      !ciudad ||
      !edad
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (isNaN(Number(edad)) || Number(edad) < 10 || Number(edad) > 120) {
      setError("La edad debe ser un número entre 10 y 120.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          password,
          rol,
          telefono,
          pais,
          ciudad,
          edad: Number(edad),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Error registrando usuario");
        return;
      }
      setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
      // Opcional: redirigir automáticamente a login después de 2 segundos
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Registro de usuario</h2>
        {error && <p className="mb-3 text-red-600">{error}</p>}
        {success && <p className="mb-3 text-green-600">{success}</p>}
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mb-3 p-2 w-full border rounded"
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
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
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          className="mb-3 p-2 w-full border rounded"
          required
        >
          <option value="">Selecciona el rol</option>
          <option value="profesor">Organizador/Profesor</option>
          <option value="alumno">Asistente/Alumno</option>
        </select>
        <input
          type="text"
          placeholder="Teléfono con indicativo de país +XX"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="mb-3 p-2 w-full border rounded"
          required
        />
        <input
          type="text"
          placeholder="País"
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          className="mb-3 p-2 w-full border rounded"
          required
        />
        <input
          type="text"
          placeholder="Ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          className="mb-3 p-2 w-full border rounded"
          required
        />
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          min={10}
          max={120}
          className="mb-5 p-2 w-full border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition"
        >
          Registrarme
        </button>
        <button
          type="button"
          className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-blue-700 py-2 rounded font-bold transition"
          onClick={() => navigate("/")}
        >
          Volver al login
        </button>
      </form>
    </div>
  );
}

export default Register;
