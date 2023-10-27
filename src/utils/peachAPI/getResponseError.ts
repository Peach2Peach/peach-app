const isCloudflareChallenge = (response: Response) => response.headers.get('cf-mitigated') === 'challenge'

export const getResponseError = (response: Response): string | null => {
  if (response.statusText === 'Aborted') return 'ABORTED'

  if (isCloudflareChallenge(response)) return 'HUMAN_VERIFICATION_REQUIRED'
  if (response.status === 0) return 'EMPTY_RESPONSE'
  if (response.status === 500) return 'INTERNAL_SERVER_ERROR'
  if (response.status === 503) return 'SERVICE_UNAVAILABLE'
  if (response.status === 429) return 'TOO_MANY_REQUESTS'
  if (!response.status) return 'NETWORK_ERROR'
  return null
}
