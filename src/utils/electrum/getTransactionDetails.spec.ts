import fetch from '../fetch'
import { getTransactionDetails } from './getTransactionDetails'

jest.mock('../fetch')

describe('getTransactionDetails', () => {
  it('calls endpoint to fetch tx hex', async () => {
    const txId = 'txId'

    await getTransactionDetails({ txId })
    expect(fetch).toHaveBeenCalledWith('https://localhost:3000/tx/txId', {
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
