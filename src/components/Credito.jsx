export const crearCredito = async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ message: "No autorizado" })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { clienteId, montoPrestamo, montoAPagar, fechaPago } = req.body

    if (!clienteId || !montoPrestamo || !montoAPagar) {
      return res.status(400).json({ message: "Datos incompletos" })
    }

    const cliente = await Cliente.findById(clienteId)

    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" })
    }

    const nuevoCredito = await Credito.create({
      clienteId: clienteId,
      cobradorId: decoded.userId,
      montoPrestamo,
      montoAPagar,
      fechaPago
    })

    res.status(201).json(nuevoCredito)

  } catch (error) {
    console.log("Error creando crédito:", error)
    res.status(500).json({ message: "Error creando crédito" })
  }
}