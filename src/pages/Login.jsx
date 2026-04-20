import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/auth/login-cobrador", {
        email,
        password
      })

      localStorage.setItem("token", res.data.token)

      navigate("/home")

    } catch (err) {
      setError("Credenciales incorrectas")
    }
  }

  return (
    <div style={container}>
      <h2>Login Cobrador</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={input}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={input}
      />

      <button onClick={handleLogin} style={button}>
        Ingresar
      </button>
    </div>
  )
}

const container = {
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 15
}

const input = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ccc"
}

const button = {
  padding: 15,
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: 10
}

export default Login