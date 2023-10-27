import fetch from '../fetch'
import { getTransactionDetails } from './getTransactionDetails'

jest.mock('../fetch')

describe('getTransactionDetails', () => {
  it('calls endpoint to fetch tx hex', async () => {
    const txId = 'txId'

    await getTransactionDetails({ txId })
    expect(fetch).toHaveBeenCalledWith('https://localhost:3000/tx/txId', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: 'https://localhost:8080',
        Referer: 'https://localhost:8080',
        'User-Agent': '',
      },
      method: 'GET',
      signal: undefined,
    })
  })
})
