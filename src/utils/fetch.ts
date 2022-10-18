import { info, error } from './log'

/**
 * @description Method to generate timeout signal for fetch requests
 * @param timeout timeout in ms
 * @returns AbortSignal
 */
export const getAbortSignal = (timeout: number) => {
  const controller = new AbortController()
  const signal = controller.signal
  setTimeout(() => controller.abort(), timeout)

  return signal
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
        error('fetch error', `${init?.method || 'GET'} - ${err.status} - ${err.statusText} - ${url}`, err)
      }),
  )
