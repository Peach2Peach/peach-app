import { error } from '../log/error'
import { parseError } from '../result/parseError'
import { dateTimeReviver } from '../system/dateTimeReviver'

const OK_STATUS = 200
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

    if (response.status !== OK_STATUS) {
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

const isCloudflareChallenge = (headers: Response['headers']) => headers.get('cf-mitigated') === 'challenge'

const RESPONSE_ERRORS = {
  0: 'EMPTY_RESPONSE',
  429: 'TOO_MANY_REQUESTS',
  500: 'INTERNAL_SERVER_ERROR',
  503: 'SERVICE_UNAVAILABLE',
  ABORTED: 'ABORTED',
  NETWORK_ERROR: 'NETWORK_ERROR',
}

const isErrorStatus = (status?: number | string | null): status is keyof typeof RESPONSE_ERRORS =>
  typeof status !== 'undefined' && status !== null && status in RESPONSE_ERRORS

function getResponseError ({ statusText, status, headers }: Response) {
  if (statusText === 'Aborted') return RESPONSE_ERRORS.ABORTED

  if (headers && isCloudflareChallenge(headers)) return 'HUMAN_VERIFICATION_REQUIRED'
  if (isErrorStatus(status)) return RESPONSE_ERRORS[status]
  if (!status) return RESPONSE_ERRORS.NETWORK_ERROR
  return null
}
