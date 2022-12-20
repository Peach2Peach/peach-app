import { info, error } from './log'
import { parseError } from './system'

export const getAbortWithTimeout = (timeout?: number) => {
  const controller = new AbortController()
  if (timeout) setTimeout(() => controller.abort(), timeout)

  return controller
}

export default (url: RequestInfo, init?: RequestInit): Promise<Response> =>
  new Promise((resolve) =>
    fetch(url, init)
      .then((response) => {
        resolve(response)
        info('fetch success', init?.method || 'GET', response.status, response.statusText, url)
      })
      .catch((err) => {
        resolve(err)
        error('fetch error', `${init?.method || 'GET'} - ${err.status} - ${err.statusText} - ${url}`, parseError(err))
      }),
  )
