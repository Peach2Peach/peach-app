import { error } from '../log/error'
import { parseError } from '../result/parseError'
import { dateTimeReviver } from '../system/dateTimeReviver'

export const parseResponse = async <T>(
  response: Response,
  caller: string,
  string = false,
): Promise<[T | null, APIError | null]> => {
  try {
    const responseError = getResponseError(response)
    if (responseError === 'ABORTED') return [null, null]
    if (responseError) return [null, { error: responseError }]

    const data = !string ? JSON.parse(await response.text(), dateTimeReviver) : await response.text()

    if (response.status !== 200) {
      if (data.error === 'CONTRACT_EXISTS') return [null, data]
      error(
        `peachAPI - ${caller}`,
        JSON.stringify({
          status: response.status,
          data,
        }),
      )

      return [null, data]
    }
    return [data, null]
  } catch (e) {
    const parsedError = parseError(e)
    if (parsedError.includes('JSON Parse error')) {
      error(`peachAPI - ${caller}`, parsedError)
      return [null, { error: 'INTERNAL_SERVER_ERROR' }]
    }
    error(`peachAPI - ${caller}`, e)

    return [null, { error: 'INTERNAL_SERVER_ERROR' }]
  }
}

const isCloudflareChallenge = (response: Response) => response.headers.get('cf-mitigated') === 'challenge'

function getResponseError (response: Response) {
  if (response.statusText === 'Aborted') return 'ABORTED'

  if (isCloudflareChallenge(response)) return 'HUMAN_VERIFICATION_REQUIRED'
  if (response.status === 0) return 'EMPTY_RESPONSE'
  if (response.status === 500) return 'INTERNAL_SERVER_ERROR'
  if (response.status === 503) return 'SERVICE_UNAVAILABLE'
  if (response.status === 429) return 'TOO_MANY_REQUESTS'
  if (!response.status) return 'NETWORK_ERROR'
  return null
}
