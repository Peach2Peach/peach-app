import { matchFn } from '.'
import * as offerData from '../../../../tests/unit/data/offerData'
import { getError, getResult } from '../../../utils/result'

const selectedCurrency: Currency = 'EUR'
const selectedPaymentMethod: PaymentMethod = 'sepa'

const match = offerData.matchOffer
const offer = offerData.sellOffer

const updateMessage = jest.fn()

const defaultOfferData = {
  offerId: offer.id,
  matchingOfferId: match.offerId,
  currency: selectedCurrency,
  paymentMethod: selectedPaymentMethod,
  symmetricKeyEncrypted: undefined,
  symmetricKeySignature: undefined,
  paymentDataEncrypted: undefined,
  paymentDataSignature: undefined,
  hashedPaymentData: undefined,
  price: 21000,
  premium: 21,
}

const generateMatchOfferDataMock = jest.fn().mockResolvedValue(getResult(defaultOfferData))
jest.mock('./generateMatchOfferData', () => ({
  generateMatchOfferData: () => generateMatchOfferDataMock(),
}))
const matchOfferMock = jest.fn(
  (): Promise<[MatchResponse | null, APIError | null]> =>
    Promise.resolve([{ ...(offer.paymentData[selectedPaymentMethod] || null), success: true }, null]),
)
jest.mock('../../../utils/peachAPI', () => ({
  matchOffer: () => matchOfferMock(),
}))

describe('matchFn', () => {
  it('should return the result if successful', async () => {
    const result = await matchFn(match, offer, selectedCurrency, selectedPaymentMethod, updateMessage)
    expect(result).toBeDefined()
  })

  it('should throw an error if no offer id', async () => {
    const offerWithoutId = { ...offer, id: undefined }
    await expect(
      // @ts-expect-error testing invalid input
      matchFn(match, offerWithoutId, selectedCurrency, selectedPaymentMethod, updateMessage),
    ).rejects.toThrow()
  })

  it('should throw an error if no selected currency', async () => {
    const selectedCurrencyWithoutValue = undefined
    await expect(
      matchFn(match, offer, selectedCurrencyWithoutValue, selectedPaymentMethod, updateMessage),
    ).rejects.toThrow()
  })

  it('should throw an error if no selected payment method', async () => {
    const selectedPaymentMethodWithoutValue = undefined
    await expect(
      matchFn(match, offer, selectedCurrency, selectedPaymentMethodWithoutValue, updateMessage),
    ).rejects.toThrow()
  })

  it('should throw an error if no match offer data', async () => {
    generateMatchOfferDataMock.mockResolvedValueOnce(getError('MISSING_PAYMENTDATA'))
    const matchOfferData = 'MISSING_PAYMENTDATA'
    await expect(matchFn(match, offer, selectedCurrency, selectedPaymentMethod, updateMessage)).rejects.toThrow(
      matchOfferData,
    )
  })

  it('should throw an error if no result', async () => {
    matchOfferMock.mockResolvedValueOnce([null, { error: 'UNKNOWN_ERROR' }])
    await expect(matchFn(match, offer, selectedCurrency, selectedPaymentMethod, updateMessage)).rejects.toThrow()
  })
})
