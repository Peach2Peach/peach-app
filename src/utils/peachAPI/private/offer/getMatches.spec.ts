import { API_URL } from '@env'
import { getMatches } from './getMatches'

const fetchMock = jest.fn().mockResolvedValue({
  json: () => Promise.resolve({}),
  ok: true,
})
jest.mock('../../../fetch', () => ({
  __esModule: true,
  default: (...args: any[]) => fetchMock(...args),
}))

const mockHeaders = {
  'Content-Type': 'application/json',
  Origin: API_URL,
  Referer: API_URL,
  Accept: 'application/json',
  Authorization: 'token',
}
const getPrivateHeadersMock = jest.fn().mockResolvedValue(mockHeaders)

jest.mock('../getPrivateHeaders', () => ({
  getPrivateHeaders: (...args: any[]) => getPrivateHeadersMock(...args),
}))

describe('getMatches', () => {
  it('should call fetch with the correct arguments', async () => {
    await getMatches({ offerId: 'offerId', sortBy: ['highestAmount'] })

    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/v1/offer/offerId/matches?page=0&size=21&sortBy=highestAmount`, {
      headers: mockHeaders,
      method: 'GET',
      signal: undefined,
    })
  })
  it('should join multiple sorters with commas', async () => {
    await getMatches({ offerId: 'offerId', sortBy: ['highestAmount', 'bestReputation'] })

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/v1/offer/offerId/matches?page=0&size=21&sortBy=highestAmount,bestReputation`,
      {
        headers: mockHeaders,
        method: 'GET',
        signal: undefined,
      },
    )
  })
})
