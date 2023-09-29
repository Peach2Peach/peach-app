import { FIFTEEN_SECONDS } from '../../../../constants'
import { error, info } from '../../../log'
import { getAccessToken } from '../../accessToken'
import { auth } from './auth'

let fetchingToken: Promise<AccessToken> | null

export const fetchAccessToken = async (): Promise<string> => {
  const accessToken = getAccessToken()
  if (accessToken && accessToken.expiry > new Date().getTime() + 60 * 1000) {
    return `Basic ${Buffer.from(accessToken.accessToken)}`
  }

  if (fetchingToken) {
    info('Authentication already in progress, waiting...')
    await fetchingToken
    info('Background authentication finished')
    if (accessToken) return `Basic ${Buffer.from(accessToken.accessToken)}`
  }

  info('Starting authentication, waiting...')

  // eslint-disable-next-line require-atomic-updates
  fetchingToken = new Promise(async (resolve, reject) => {
    const [result, err] = await auth({ timeout: FIFTEEN_SECONDS })

    if (!result || err) {
      error('peachAPI - fetchAccessToken', err?.error)
      reject(err?.error || 'AUTHENTICATION_FAILURE')
      fetchingToken = null
      return
    }
    resolve(result)
    fetchingToken = null
  })

  const result = await fetchingToken
  info('Authentication finished')

  return `Basic ${Buffer.from(result.accessToken)}`
}
