import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
})

export interface LinkDTO {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: string
}

export async function fetchLinks(): Promise<LinkDTO[]> {
  const { data } = await api.get<LinkDTO[]>('/links')
  return data
}

export async function createLink(input: {
  originalUrl: string
  shortUrl: string
}): Promise<LinkDTO> {
  const { data } = await api.post<LinkDTO>('/links', input)
  return data
}

export async function deleteLink(shortUrl: string): Promise<void> {
  await api.delete(`/links/${shortUrl}`)
}

export async function resolveLink(shortUrl: string): Promise<LinkDTO> {
  const { data } = await api.get<LinkDTO>(`/links/${shortUrl}`)
  return data
}

export async function exportLinksCsv(): Promise<string> {
  const { data } = await api.get<{ url: string }>('/links/export')
  return data.url
}
