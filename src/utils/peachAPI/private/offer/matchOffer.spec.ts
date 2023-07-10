import { API_URL } from '@env'
import { omit } from '../../../object'
import { matchOffer } from './matchOffer'

const fetchMock = jest.fn()
jest.mock('../../../fetch', () => ({
  __esModule: true,
  default: (...args: any[]) => fetchMock(...args),
}))

jest.mock('../getPrivateHeaders', () => ({
  getPrivateHeaders: () => ({
    'Content-Type': 'application/json',
    'X-Api-Key': undefined,
  }),
}))

describe('matchOffer', () => {
  const match = {
    offerId: 'offerId',
    matchingOfferId: 'matchingOfferId',
    currency: 'EUR',
    paymentMethod: 'sepa',
    price: 100,
    symmetricKeyEncrypted: 'symmetricKeyEncrypted',
    symmetricKeySignature: 'symmetricKeySignature',
    paymentDataEncrypted: 'paymentDataEncrypted',
    paymentDataSignature: 'paymentDataSignature',
  } as const
  it('should call fetch with the correct arguments', async () => {
    const response = {
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    }
    fetchMock.mockResolvedValue(response)
    await matchOffer(match)
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/v1/offer/offerId/match`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': undefined,
      },
      body: JSON.stringify(omit(match, 'offerId')),
      method: 'POST',
      signal: undefined,
    })
  })
})
