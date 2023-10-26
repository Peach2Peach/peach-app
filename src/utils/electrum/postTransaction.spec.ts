import fetch from '../fetch'
import { postTransaction } from './postTransaction'

jest.mock('../fetch')

describe('postTransaction', () => {
  it('calls endpoint to post transaction', async () => {
    const tx = 'tx'

    await postTransaction({ tx })
    expect(fetch).toHaveBeenCalledWith('https://localhost:3000/tx', {
      headers: {
        Accept: 'text/html',
        'Content-Type': 'text/html',
        Origin: 'https://localhost:8080',
        Referer: 'https://localhost:8080',
        'User-Agent': '',
      },
      method: 'POST',
      body: tx,
      signal: undefined,
    })
  })
})
