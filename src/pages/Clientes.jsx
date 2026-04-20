import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import ModalCredito from "../components/ModalCredito"

function Clientes() {

  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [loading, setLoading] = useState(true)

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [creditos, setCreditos] = useState([])
  const [mostrarModalCredito, setMostrarModalCredito] = useState(false)

  useEffect(() => {
    obtenerClientes()
  }, [])

  const obtenerClientes = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await api.get("/clientes", {
        headers: { Authorization: `Bearer ${token}` }
      })

      setClientes(res.data)

    } catch (error) {
      console.log("Error al cargar clientes", error)
    } finally {
      setLoading(false)
    }
  }

  const cargarCreditos = async (clienteId) => {
    try {
      const token = localStorage.getItem("token")

      const res = await api.get(
        `/creditos/cliente/${clienteId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setCreditos(res.data)

    } catch (error) {
      console.log("Error cargando créditos", error)
    }
  }

  const marcarComoPagado = async (creditoId) => {
    try {
      await api.put(`/creditos/${creditoId}/pagar`)
      cargarCreditos(clienteSeleccionado._id)
    } catch (error) {
      console.log("Error marcando como pagado", error)
    }
  }

  const abonar = async (creditoId) => {
    const monto = prompt("Ingrese monto del abono")

    if (!monto || Number(monto) <= 0) return

    try {
      const token = localStorage.getItem("token")

      await api.post(
        `/creditos/abonar/${creditoId}`,
        { monto: Number(monto) },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      cargarCreditos(clienteSeleccionado._id)

    } catch (error) {
      alert(error.response?.data?.message || "Error registrando abono")
    }
  }

  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.cedula?.includes(busqueda)
  )

  if (loading) {
    return <p style={{ padding: 20 }}>Cargando clientes...</p>
  }

  return (
    <div>

      {/* HEADER FIJO */}
      <div style={header}>
        <button
          style={backBtn}
          onClick={() => navigate("/home")}
        >
          ← 
        </button>

        <div>
          <h2 style={{ margin: 0 }}>Clientes</h2>
          <small>{new Date().toLocaleDateString()}</small>
        </div>
      </div>

      <div style={{ padding: 15, marginTop: 90 }}>

        <input
          placeholder="Buscar por nombre o cédula"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={input}
        />

        <div style={{ marginTop: 15 }}>
          {clientesFiltrados.map(cliente => {

            const expandido = clienteSeleccionado?._id === cliente._id

            return (
              <div
                key={cliente._id}
                style={{
                  ...card,
                  backgroundColor: expandido ? "#f9fafb" : "white"
                }}
              >

                <div
                  onClick={() => {
                    if (expandido) {
                      setClienteSeleccionado(null)
                      setCreditos([])
                    } else {
                      setClienteSeleccionado(cliente)
                      cargarCreditos(cliente._id)
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <strong>{cliente.nombre}</strong>
                  <p>Cédula: {cliente.cedula}</p>
                </div>

                {expandido && (
                  <div style={{ marginTop: 15 }}>

                    <p><strong>Teléfono:</strong> {cliente.telefono || "No registrado"}</p>
                    <p><strong>Dirección:</strong> {cliente.direccion || "No registrada"}</p>

                    {!creditos.some(c => c.estado === "PENDIENTE") && (
                      <button
                        style={crearBtn}
                        onClick={() => setMostrarModalCredito(true)}
                      >
                        + Crear Crédito
                      </button>
                    )}

                    <h4 style={{ marginTop: 20 }}>Historial</h4>

                    {creditos.length === 0 && (
                      <p>No tiene créditos</p>
                    )}

                    {creditos.map(c => {

                      const porcentaje =
                        ((c.montoAPagar - c.saldoPendiente) / c.montoAPagar) * 100

                      return (
                        <div
                          key={c._id}
                          style={{
                            ...creditoCard,
                            borderLeft: c.estado === "PENDIENTE"
                              ? "5px solid #dc2626"
                              : "5px solid #16a34a"
                          }}
                        >
                          <p><strong>Monto:</strong> {c.montoPrestamo}</p>
                          <p><strong>Total a pagar:</strong> {c.montoAPagar}</p>
                          <p><strong>Saldo pendiente:</strong> {c.saldoPendiente}</p>
                          <p><strong>Estado:</strong> {c.estado}</p>

                          <div style={barraContainer}>
                            <div
                              style={{
                                ...barraProgreso,
                                width: `${porcentaje}%`
                              }}
                            />
                          </div>

                          {c.estado === "PENDIENTE" && (
                            <>
                              <button
                                style={abonarBtn}
                                onClick={() => abonar(c._id)}
                              >
                                Abonar
                              </button>

                              {c.saldoPendiente === 0 && (
                                <button
                                  style={pagarBtn}
                                  onClick={() => marcarComoPagado(c._id)}
                                >
                                  Marcar como Pagado
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })}

                  </div>
                )}
              </div>
            )
          })}
        </div>

        {mostrarModalCredito && clienteSeleccionado && (
          <ModalCredito
            clienteId={clienteSeleccionado._id}
            onClose={() => setMostrarModalCredito(false)}
            onCreated={() => cargarCreditos(clienteSeleccionado._id)}
          />
        )}
      </div>
    </div>
  )
}

/* ================= ESTILOS ================= */

const header = {
  position: "sticky",
  top: 0,
  backgroundColor: "white",
  padding: 15,
  display: "flex",
  alignItems: "center",
  gap: 15,
  borderBottom: "1px solid #ddddddff",
  color: "#111827",
  zIndex: 1000
}

const backBtn = {
  padding: 8,
  backgroundColor: "#a5b1c9ff",
  border: "none",
  borderRadius: 8,
  fontSize: 14
}

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #e5e7eb"
}

const card = {
  padding: 15,
  marginTop: 10,
  border: "1px solid #111827",
  borderRadius: 12,
  backgroundColor: "#7785a4ff",
  color: "#111827"
}

const creditoCard = {
  padding: 15,
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  marginBottom: 10,
  backgroundColor: "#c9d0deff",
  color: "#111827"
}

const crearBtn = {
  marginTop: 15,
  padding: 12,
  backgroundColor: "#3461c2ff",
  color: "white",
  borderRadius: 10,
  border: "none"
}

const pagarBtn = {
  marginTop: 10,
  padding: 8,
  backgroundColor: "#16a34a",
  color: "white",
  borderRadius: 8,
  border: "none"
}

const abonarBtn = {
  marginTop: 10,
  marginRight: 8,
  padding: 8,
  backgroundColor: "#f59e0b",
  color: "white",
  borderRadius: 8,
  border: "none"
}

const barraContainer = {
  width: "100%",
  height: 8,
  backgroundColor: "#e5e7eb",
  borderRadius: 4,
  marginTop: 8,
  marginBottom: 8
}

const barraProgreso = {
  height: "100%",
  backgroundColor: "#16a34a",
  borderRadius: 4
}

export default Clientes