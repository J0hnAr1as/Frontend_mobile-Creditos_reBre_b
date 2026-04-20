import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function Creditos() {

  const navigate = useNavigate()

  const [creditos, setCreditos] = useState([])
  const [loading, setLoading] = useState(true)
  const [creditoSeleccionado, setCreditoSeleccionado] = useState(null)

  useEffect(() => {
    cargarCreditos()
  }, [])

  const cargarCreditos = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await api.get("/creditos", {
        headers: { Authorization: `Bearer ${token}` }
      })

      setCreditos(res.data)

    } catch (error) {
      console.log("Error cargando créditos", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p style={{ padding: 20 }}>Cargando créditos...</p>

  return (
    <div>

      {/* HEADER */}
      <div style={header}>
        <button style={backBtn} onClick={() => navigate("/home")}>
          ←
        </button>
        <h2 style={{ margin: 0 }}>Créditos</h2>
      </div>

      <div style={{ padding: 15, marginTop: 70 }}>

        {creditos.map(c => (
          <div
            key={c._id}
            style={card}
            onClick={() => setCreditoSeleccionado(c)}
          >
            <strong>{c.clienteId?.nombre}</strong>
            <p>Total: {c.montoAPagar}</p>
            <p>Estado: {c.estado}</p>
          </div>
        ))}

      </div>

      {/* MODAL DETALLE */}
      {creditoSeleccionado && (
        <div style={overlay}>
          <div style={modal}>

            <h3 style={{ marginTop: 0 }}>Detalle Crédito</h3>

            <p style={textLine}>
              <strong>Cliente:</strong> {creditoSeleccionado.clienteId?.nombre}
            </p>

            <p style={textLine}>
              <strong>Fecha origen:</strong>{" "}
              {new Date(creditoSeleccionado.fechaOrigen).toLocaleDateString()}
            </p>

            <p style={textLine}>
              <strong>Fecha pago:</strong>{" "}
              {new Date(creditoSeleccionado.fechaPago).toLocaleDateString()}
            </p>

            <p style={textLine}>
              <strong>Monto prestado:</strong>{" "}
              {creditoSeleccionado.montoPrestamo}
            </p>

            <p style={textLine}>
              <strong>Monto a pagar:</strong>{" "}
              {creditoSeleccionado.montoAPagar}
            </p>

            <p style={textLine}>
              <strong>Saldo pendiente:</strong>{" "}
              {creditoSeleccionado.saldoPendiente}
            </p>

            <button
              style={volverBtn}
              onClick={() => setCreditoSeleccionado(null)}
            >
              Volver
            </button>

          </div>
        </div>
      )}

    </div>
  )
}

/* ================= ESTILOS ================= */

const header = {
  position: "fixed",
  top: 0,
  width: "100%",
  backgroundColor: "white",
  padding: 15,
  display: "flex",
  alignItems: "center",
  gap: 15,
  borderBottom: "1px solid #ddd",
  color: "#111827",
  zIndex: 1000
}

const backBtn = {
  padding: 8,
  backgroundColor: "#a5b1c9ff",
  border: "none",
  borderRadius: 8
}

const card = {
  padding: 15,
  marginBottom: 10,
  borderRadius: 12,
  border: "1px solid #ddd",
  backgroundColor: "white",
  color: "#111827",
  cursor: "pointer"
}

/* ===== MODAL OSCURO ===== */

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000
}

const modal = {
  backgroundColor: "#0B2A4A",
  padding: 28,
  borderRadius: 20,
  width: "90%",
  maxWidth: 420,
  color: "#F1F5F9",
  display: "flex",
  flexDirection: "column",
  gap: 1,
  boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
}

const textLine = {
  opacity: 0.9
}

const volverBtn = {
  marginTop: 20,
  padding: 14,
  width: "100%",
  background: "linear-gradient(90deg, #2E6FA3, #3B82F6)",
  color: "white",
  border: "none",
  borderRadius: 14,
  fontWeight: "600",
  cursor: "pointer"
}

export default Creditos