import { API_URL } from '@env'
import { buyOffer } from '../../../../../tests/unit/data/offerData'
import { postBuyOffer } from './postBuyOffer'
const paymentData: OfferPaymentData = {
  sepa: {
    hashes: ['hash'],
    country: 'DE',
  },
}
const responseBody: PostOfferResponseBody = {
  ...buyOffer,
  id: 'id',
  type: 'bid',
  amount: [1000, 2000],
  meansOfPayment: {
    EUR: ['sepa'],
  },
  paymentData,
  releaseAddress: 'releaseAddress',
  online: true,
  matches: [],
  doubleMatched: false,
  matched: [],
  seenMatches: [],
  creationDate: new Date('2021-01-01'),
}
const fetchMock = jest.fn().mockImplementation((url: string) => {
  if (url === `${API_URL}/v1/offer`) {
    return {
      ok: true,
      json: () => responseBody,
    }
  }
  return {
    ok: false,
    json: () => ({
      error: 'error',
    }),
  }
})
jest.mock('../../../fetch', () => ({
  __esModule: true,
  default: (...args: unknown[]) => fetchMock(...args),
}))

jest.mock('../user', () => ({
  fetchAccessToken: jest.fn(),
}))

const parseResponseMock = jest.fn().mockImplementation(async (response) => {
  if (response.ok) {
    return [await response.json(), null]
  }
  return [null, await response.json()]
})
jest.mock('../../parseResponse', () => ({
  parseResponse: (...args: unknown[]) => parseResponseMock(...args),
}))

// eslint-disable-next-line max-lines-per-function
describe('postBuyOffer', () => {
  const defaultArgs = {
    headers: {
      Accept: 'application/json',
      Authorization: undefined,
      'Content-Type': 'application/json',
      Origin: 'https://localhost:8080',
      Referer: 'https://localhost:8080',
      'User-Agent': '',
    },
    method: 'POST',
    signal: undefined,
  }
  it('should call fetch with the right arguments', async () => {
    const offerDraft: Omit<BuyOfferDraft, 'originalPaymentData'> = {
      type: 'bid',
      amount: [1000, 2000],
      meansOfPayment: {
        EUR: ['sepa'],
      } satisfies OfferDraft['meansOfPayment'],
      paymentData,
      releaseAddress: 'releaseAddress',
      maxPremium: null,
    }
    await postBuyOffer(offerDraft)
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/v1/offer`, {
      ...defaultArgs,
      body: JSON.stringify(offerDraft),
    })
  })
  it('should return the response body and null if the request is successful', async () => {
    const offerDraft: Omit<BuyOfferDraft, 'originalPaymentData'> = {
      type: 'bid',
      amount: [1000, 2000],
      meansOfPayment: {
        EUR: ['sepa'],
      } satisfies OfferDraft['meansOfPayment'],
      paymentData,
      releaseAddress: 'releaseAddress',
      maxPremium: null,
    }

    const result = await postBuyOffer(offerDraft)
    expect(result).toEqual([responseBody, null])
  })
  it('should return null and an APIError if the request is not successful', async () => {
    const offerDraft: Omit<BuyOfferDraft, 'originalPaymentData'> = {
      type: 'bid',
      amount: [1000, 2000],
      meansOfPayment: {
        EUR: ['sepa'],
      } satisfies OfferDraft['meansOfPayment'],
      paymentData,
      releaseAddress: 'releaseAddress',
      maxPremium: null,
    }
    const error: APIError = {
      error: 'error',
    }
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: () => error,
    })
    const result = await postBuyOffer(offerDraft)
    expect(result).toEqual([null, error])
  })

  it('should not send sensitive data to the server', async () => {
    const offerDraft = {
      type: 'bid',
      amount: [1000, 2000],
      meansOfPayment: {
        EUR: ['sepa'],
      } satisfies OfferDraft['meansOfPayment'],
      paymentData,
      releaseAddress: 'releaseAddress',
      maxPremium: null,
      originalPaymentData: {
        sepa: {
          iban: 'iban',
          bic: 'bic',
          holder: 'holder',
        },
      },
      otherSensitiveData: ['myPrivateKey'],
    }
    // @ts-expect-error all necessary data is passed
    await postBuyOffer(offerDraft)
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/v1/offer`, {
      ...defaultArgs,
      body: JSON.stringify({
        type: 'bid',
        amount: [1000, 2000],
        meansOfPayment: {
          EUR: ['sepa'],
        },
        paymentData,
        releaseAddress: 'releaseAddress',
        maxPremium: null,
      }),
    })
  })
  it('should send the messageSignature to the server', async () => {
    const offerDraft = {
      type: 'bid',
      amount: [1000, 2000],
      meansOfPayment: {
        EUR: ['sepa'],
      } satisfies OfferDraft['meansOfPayment'],
      paymentData,
      releaseAddress: 'releaseAddress',
      maxPremium: null,
      messageSignature: 'messageSignature',
    }
    // @ts-expect-error all necessary data is passed
    await postBuyOffer(offerDraft)
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/v1/offer`, {
      ...defaultArgs,
      body: JSON.stringify({
        type: 'bid',
        amount: [1000, 2000],
        meansOfPayment: { EUR: ['sepa'] },
        paymentData,
        releaseAddress: 'releaseAddress',
        messageSignature: 'messageSignature',
        maxPremium: null,
      }),
    })
  })
})
