import { error, info } from '../../../log'
import { getAccessToken } from '../../accessToken'
import { auth } from './auth'

let fetchingToken: Promise<AccessToken> | null

/**
 * @description Method to get and return access token
 * @returns Access Token
 */
export const fetchAccessToken = async (): Promise<string> => {
  const accessToken = getAccessToken()
  if (accessToken && accessToken.expiry > new Date().getTime() + 60 * 1000) {
    return 'Basic ' + Buffer.from(accessToken.accessToken)
  }

  if (fetchingToken) {
    info('Authentication already in progress, waiting...')
    await fetchingToken
    info('Background authentication finished')
    if (accessToken) return 'Basic ' + Buffer.from(accessToken.accessToken)
  }

  info('Starting authentication, waiting...')

  // eslint-disable-next-line require-atomic-updates
  fetchingToken = new Promise(async (resolve) => {
    const [result, err] = await auth({})

    if (!result || err) {
      error('peachAPI - fetchAccessToken', new Error(err?.error))
      throw Error(err?.error || 'AUTHENTICATION_FAILURE')
    }
    resolve(result)
    fetchingToken = null
  })

  const result = await fetchingToken
  info('Authentication finished')

  return 'Basic ' + Buffer.from(result.accessToken)
}
