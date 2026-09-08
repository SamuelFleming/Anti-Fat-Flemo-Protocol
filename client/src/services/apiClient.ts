const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api'

export class ApiError extends Error {
  readonly status: number
  readonly details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  token?: string | null
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, headers, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (response.status === 204) {
    return undefined as T
  }

  const payload = (await response.json().catch(() => null)) as
    | { error?: { message?: string; details?: unknown } }
    | T
    | null

  if (!response.ok) {
    const errorPayload = payload as { error?: { message?: string; details?: unknown } } | null
    throw new ApiError(
      errorPayload?.error?.message ?? `Request failed (${response.status})`,
      response.status,
      errorPayload?.error?.details,
    )
  }

  return payload as T
}
