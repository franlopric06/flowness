const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const getCursos = async () => {
  const res = await fetch(`${API_URL}/cursos`)
  return res.json()
}

export const getClases = async () => {
  const res = await fetch(`${API_URL}/clases`)
  return res.json()
}

export const registro = async (datos) => {
  const res = await fetch(`${API_URL}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  return res.json()
}

export const login = async (datos) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  return res.json()
}