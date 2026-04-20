import axios from "axios"

const api = axios.create({
  baseURL: "https://backend-creditos-re-bre-b.vercel.app"
})

export default api
