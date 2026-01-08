/**
 * API Client
 * Base HTTP client for backend API calls
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `API error: ${res.status}`)
    }

    return res.json()
  }

  async post<T>(path: string, data: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `API error: ${res.status}`)
    }

    return res.json()
  }
}

export const apiClient = new ApiClient()
