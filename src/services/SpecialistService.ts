const API_URL = 'http://localhost:3333/specialists'

export default {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString()
    const res = await fetch(`${API_URL}?${query}`)
    if (!res.ok) throw new Error('Error al obtener especialistas')
    return res.json()
  },

  async create(data: any) {
    const res = await fetch(API_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Error al crear especialista')
    return res.json()
  },

  async update(id: number, data: any) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Error al actualizar especialista')
    return res.json()
  },
}
