import { API_URL } from '@env'

export const getPublicHeaders = (): RequestInit['headers'] => ({
  Origin: API_URL,
  Referer: API_URL,
  Accept: 'application/json',
  'Content-Type': 'application/json',
})
