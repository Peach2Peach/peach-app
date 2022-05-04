import { info, error } from './log'

export default (url: RequestInfo, init?: RequestInit): Promise<Response> => new Promise(resolve =>
  fetch(url, init)
    .then(response => {
      info('fetch success', init?.method || 'GET', response.status, response.statusText, url)
      resolve(response)
    })
    .catch(err => {
      error('fetch error', init?.method || 'GET', err.status, err.statusText, url, err)
      resolve(err)
    })
)