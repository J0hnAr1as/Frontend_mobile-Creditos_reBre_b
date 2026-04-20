import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Clientes from "./pages/Clientes"
import Creditos from "./pages/Creditos"
import CrearCliente from "./components/CrearCliente" //

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <Clientes />
            </PrivateRoute>
          }
        />

        {/* ✅ NUEVA RUTA AGREGADA */}
        <Route
          path="/clientes/nuevo"
          element={
            <PrivateRoute>
              <CrearCliente />
            </PrivateRoute>
          }
        />

        <Route
          path="/creditos"
          element={
            <PrivateRoute>
              <Creditos />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App