import { useState, useEffect } from "react"
import api from "../services/api"

function ModalCredito({ clienteId, onClose, onCreated }) {

  const [montoPrestamo, setMontoPrestamo] = useState("")
  const [montoAPagar, setMontoAPagar] = useState(0)
  const [fechaPago, setFechaPago] = useState("")

  useEffect(() => {
    const numero = Number(montoPrestamo)

    if (numero > 0) {
      setMontoAPagar(numero * 1.30)
    } else {
      setMontoAPagar(0)
    }
  }, [montoPrestamo])

  const handleCrear = async () => {
    try {

      if (!montoPrestamo || !fechaPago) {
        alert("Monto y fecha de pago son obligatorios")
        return
      }

      const token = localStorage.getItem("token")

      await api.post(
        "/creditos",
        {
          clienteId,
          montoPrestamo: Number(montoPrestamo),
          montoAPagar: Number(montoAPagar),
          fechaPago: new Date(fechaPago)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      onCreated()
      onClose()

    } catch (error) {
      console.log("ERROR COMPLETO:", error.response?.data || error)
      alert("Error creando crédito")
    }
  }

  return (
    <div style={overlay}>
      <div style={modal}>

        <h3 style={{ marginTop: 0 }}>Nuevo Crédito</h3>

        <p style={{ color: "#94A3B8" }}>
          <strong>Fecha inicial:</strong>{" "}
          {new Date().toLocaleDateString()}
        </p>

        <input
          style={input}
          type="text"
          inputMode="numeric"
          placeholder="Monto prestado"
          value={montoPrestamo}
          onChange={(e) => {
            const soloNumeros = e.target.value.replace(/\D/g, "")
            setMontoPrestamo(soloNumeros)
          }}
        />

        <input
          style={inputReadOnly}
          type="text"
          value={`Total a pagar: ${montoAPagar}`}
          readOnly
        />

        <input
          style={input}
          type="date"
          value={fechaPago}
          onChange={(e) => setFechaPago(e.target.value)}
        />

        <button style={btnPrimary} onClick={handleCrear}>
          Crear
        </button>

        <button style={btnSecondary} onClick={onClose}>
          Volver
        </button>

      </div>
    </div>
  )
}

/* ================= ESTILOS ================= */

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
  padding: 24,
  borderRadius: 16,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  width: "90%",
  maxWidth: 400,
  color: "#F1F5F9",
  border: "1px solid rgba(255,255,255,0.05)"
}

const input = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.1)",
  backgroundColor: "#071B34",
  color: "white",
  outline: "none"
}

const inputReadOnly = {
  ...input,
  opacity: 0.7
}

const btnPrimary = {
  padding: 12,
  backgroundColor: "#2E6FA3",
  color: "white",
  borderRadius: 12,
  border: "none",
  fontWeight: "600",
  cursor: "pointer"
}

const btnSecondary = {
  padding: 12,
  backgroundColor: "transparent",
  color: "#94A3B8",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.1)",
  cursor: "pointer"
}

export default ModalCredito