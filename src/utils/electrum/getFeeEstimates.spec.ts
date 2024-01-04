import fetch from '../fetch'
import { getFeeEstimates } from './getFeeEstimates'

jest.mock('../fetch')

describe('getFeeEstimates', () => {
  it('calls endpoint to fetch tx hex', async () => {
    await getFeeEstimates()
    expect(fetch).toHaveBeenCalledWith('https://localhost:3000/fee-estimates', {
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
