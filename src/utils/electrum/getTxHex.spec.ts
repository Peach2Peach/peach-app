import fetch from '../fetch'
import { getTxHex } from '../electrum/getTxHex'

jest.mock('../fetch')

describe('getTxHex', () => {
  it('calls endpoint to fetch tx hex', async () => {
    const txId = 'txId'

    await getTxHex({ txId })
    expect(fetch).toHaveBeenCalledWith('https://localhost:3000/tx/txId/hex', {
      headers: {
        Accept: 'text/html',
        'Content-Type': 'text/html',
        Origin: 'https://localhost:8080',
        Referer: 'https://localhost:8080',
      },
      method: 'GET',
      signal: undefined,
    })
  })
})
