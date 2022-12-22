/**
 * @description Method to check response for error codes
 * @param response response
 * @returns error or null
 */
export const getResponseError = (response: Response): string | null => {
  if (response.statusText === 'Aborted') return 'ABORTED'

  if (response.status === 0) return 'EMPTY_RESPONSE'
  if (response.status === 500) return 'INTERNAL_SERVER_ERROR'
  if (response.status === 503) return 'SERVICE_UNAVAILABLE'
  if (response.status === 429) return 'TOO_MANY_REQUESTS'
  if (!response.status) return 'NETWORK_ERROR'
  return null
}
