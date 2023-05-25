import fetch from '../fetch'
import { getTxHex } from './getTxHex'

jest.mock('../fetch')

describe('getTxHex', () => {
  it('calls endpoint to fetch tx hex', async () => {
    const txId = 'txId'

    await getTxHex({ txId })
    expect(fetch).toHaveBeenCalledWith('https://localhost:3000//tx/txId/hex', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: 'https://localhost:8080/',
        Referer: 'https://localhost:8080/',
      },
      method: 'GET',
      signal: undefined,
    })
  })
})
