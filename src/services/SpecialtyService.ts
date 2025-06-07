const API_URL = 'http://localhost:3333/specialties'

export default {
  async getAll() {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error('Error al obtener especialidades')
    return res.json()
  },
}
