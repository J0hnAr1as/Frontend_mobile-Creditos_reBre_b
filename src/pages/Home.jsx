import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div style={container}>

      <div style={topBar}>
        <button style={logoutBtn} onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <h2>Panel Cobrador</h2>

      <button style={btn} onClick={() => navigate("/clientes/nuevo")}>
        Nuevo Cliente
      </button>

      <button style={btn} onClick={() => navigate("/clientes")}>
        Clientes
      </button>

      <button style={btn} onClick={() => navigate("/creditos")}>
        Créditos
      </button>

    </div>
  )
}

/* ================= ESTILOS ================= */

const container = {
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 20
}

const topBar = {
  display: "flex",
  justifyContent: "flex-end"
}

const logoutBtn = {
  backgroundColor: "#869ba6ff",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14
}

const btn = {
  padding: 20,
  fontSize: 18,
  borderRadius: 10,
  cursor: "pointer"
}

export default Home