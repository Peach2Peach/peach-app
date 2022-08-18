import { info, error } from './log'

export default (url: RequestInfo, init?: RequestInit): Promise<Response> => new Promise(resolve =>
  fetch(url, init)
    .then(response => {
      resolve(response)
      info('fetch success', init?.method || 'GET', response.status, response.statusText, url)
    })
    .catch(err => {
      resolve(err)
      error('fetch error', new Error(`${init?.method || 'GET'} - ${err.status} - ${err.statusText} - ${url}`), err)
    })
)