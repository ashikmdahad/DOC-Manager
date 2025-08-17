import axios from 'axios'
const api=axios.create({baseURL:import.meta.env.VITE_API_BASE||'/api'})
export function setToken(t){ if(t) api.defaults.headers.common.Authorization=`Bearer ${t}`; else delete api.defaults.headers.common.Authorization }
export default api
