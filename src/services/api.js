import axios from "axios"

const api = axios.create({
  baseURL: "https://backend-creditos-re-bre-b.vercel.app/api"
})

export default api
