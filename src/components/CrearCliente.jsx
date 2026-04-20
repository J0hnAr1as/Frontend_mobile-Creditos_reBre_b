import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function CrearCliente() {
  const navigate = useNavigate()

  const [nombre, setNombre] = useState("")
  const [cedula, setCedula] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [loading, setLoading] = useState(false)

  const guardarCliente = async (e) => {
    e.preventDefault()

    if (!nombre || !cedula) {
      alert("Nombre y cédula son obligatorios")
      return
    }

    try {
      setLoading(true)

      const token = localStorage.getItem("token")

      await axios.post(
        "http://localhost:3000/api/clientes",
        {
          nombre,
          cedula,
          telefono,
          direccion
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert("Cliente creado correctamente")
      navigate("/clientes")

    } catch (error) {
      console.error("Error creando cliente:", error.response?.data || error)
      alert("Error al crear cliente")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={container}>
      <h2>Nuevo Cliente</h2>

      <form onSubmit={guardarCliente} style={form}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={input}
          required
        />

        <input
          type="text"
          placeholder="Cédula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          style={input}
          required
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          style={input}
        />

        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          style={input}
        />

        <button type="submit" style={btn} disabled={loading}>
          {loading ? "Guardando..." : "Guardar Cliente"}
        </button>

        <button
          type="button"
          style={cancelBtn}
          onClick={() => navigate("/clientes")}
        >
          Cancelar
        </button>
      </form>
    </div>
  )
}

/* ESTILOS */

const container = {
  padding: 20,
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
}

const form = {
  display: "flex",
  flexDirection: "column",
  gap: 15,
  width: "100%",
  maxWidth: 400
}

const input = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ccc"
}

const btn = {
  padding: 15,
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: "bold"
}

const cancelBtn = {
  padding: 12,
  backgroundColor: "#e5e7eb",
  border: "none",
  borderRadius: 10,
  cursor: "pointer"
}

export default CrearCliente