import { patchOffer } from './patchOffer'
import { API_URL } from '@env'
import { omit } from '../../../object'

const fetchMock = jest.fn()
jest.mock('../../../fetch', () => ({
  __esModule: true,
  default: (...args: unknown[]) => fetchMock(...args),
}))

jest.mock('../getPrivateHeaders', () => ({
  getPrivateHeaders: () => ({
    'Content-Type': 'application/json',
    'X-Api-Key': undefined,
  }),
}))

describe('patchOffer', () => {
  const props = {
    offerId: 'offerId',
    refundAddress: 'refundAddress',
    refundTx: 'refundTx',
    premium: 10,
  }
  it('should call fetch with the correct arguments', async () => {
    await patchOffer(props)
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/v1/offer/offerId`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': undefined,
      },
      body: JSON.stringify(omit(props, 'offerId')),
      method: 'PATCH',
      signal: undefined,
    })
  })
  it('should not send undefined values', async () => {
    await patchOffer({ ...props, refundAddress: undefined })
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/v1/offer/offerId`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': undefined,
      },
      body: JSON.stringify(omit(omit(props, 'refundAddress'), 'offerId')),
      method: 'PATCH',
      signal: undefined,
    })
  })
  it('should send null values', async () => {
    await patchOffer({ ...props, maxPremium: null })
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/v1/offer/offerId`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': undefined,
      },
      body: JSON.stringify({ ...omit(props, 'offerId'), maxPremium: null }),
      method: 'PATCH',
      signal: undefined,
    })
  })
})
