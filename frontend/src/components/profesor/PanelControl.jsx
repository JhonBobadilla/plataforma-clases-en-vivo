import { useState } from "react";
import axios from "axios";

function PanelControl({ user, onLogout }) {
  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    edad: user?.edad || "",
    ciudad: user?.ciudad || "",
    pais: user?.pais || "",
    password: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [editando, setEditando] = useState(false);
  const token = localStorage.getItem("token");

  // Maneja cambios en inputs
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Editar usuario (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    // Solo envía password si no está vacío
    const dataToSend = { ...form };
    if (!form.password) delete dataToSend.password;
    try {
      await axios.put(
        `http://localhost:3000/api/usuarios/${user.id}`,
        dataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("✅ Usuario actualizado correctamente.");
      setEditando(false);
      setForm((f) => ({ ...f, password: "" })); // Limpia el campo password
    } catch {
      setMensaje("❌ Error al actualizar usuario.");
    }
  };

  // Eliminar usuario (DELETE)
  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar tu usuario? Esta acción es irreversible.")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/usuarios/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("✅ Usuario eliminado. Saliendo...");
      setTimeout(() => {
        if (onLogout) onLogout();
      }, 1500);
    } catch {
      setMensaje("❌ Error al eliminar usuario.");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">🛠️EDITAR</h2>
      {mensaje && <p className="mb-4 text-center font-semibold">{mensaje}</p>}
      {!editando ? (
        <>
          <div className="mb-4 space-y-2">
            <div><span className="font-bold">Nombre:</span> {form.nombre}</div>
            <div><span className="font-bold">Email:</span> {form.email}</div>
            <div><span className="font-bold">Teléfono:</span> {form.telefono}</div>
            <div><span className="font-bold">Edad:</span> {form.edad}</div>
            <div><span className="font-bold">Ciudad:</span> {form.ciudad}</div>
            <div><span className="font-bold">País:</span> {form.pais}</div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              onClick={() => setEditando(true)}
            >
              Editar usuario
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              onClick={handleDelete}
            >
              Eliminar usuario
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Nombre:</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          
          <div>
            <label className="block font-semibold">Teléfono:</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Edad:</label>
            <input
              name="edad"
              type="number"
              value={form.edad}
              onChange={handleChange}
              className="w-full border rounded p-2"
              min={0}
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Ciudad:</label>
            <input
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">País:</label>
            <input
              name="pais"
              value={form.pais}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Contraseña (para cambiar):</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded p-2"
              autoComplete="new-password"
            />
            <span className="text-xs text-gray-500">
              Deja vacío para no modificar la contraseña.
            </span>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded text-sm"
              onClick={() => setEditando(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PanelControl;

