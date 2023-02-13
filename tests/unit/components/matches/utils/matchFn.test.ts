import { matchFn } from '../../../../../src/components/matches/utils'
import * as offerData from '../../../data/offerData'

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
}

const generateMatchOfferDataMock = jest.fn(() => [defaultOfferData, undefined])
jest.mock('../../../../../src/components/matches/utils/generateMatchOfferData', () => ({
  generateMatchOfferData: () => generateMatchOfferDataMock(),
}))
const matchOfferMock = jest.fn(() => [offer.paymentData[selectedPaymentMethod], undefined])
jest.mock('../../../../../src/utils/peachAPI/private/offer/matchOffer', () => ({
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
      // @ts-expect-error
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
    generateMatchOfferDataMock.mockReturnValueOnce([undefined, 'MISSING_PAYMENTDATA'])
    const matchOfferData = 'MISSING_PAYMENTDATA'
    await expect(matchFn(match, offer, selectedCurrency, selectedPaymentMethod, updateMessage)).rejects.toThrow(
      matchOfferData,
    )
  })

  it('should throw an error if no result', async () => {
    matchOfferMock.mockReturnValueOnce([undefined, 'UNKNOWN_ERROR'])
    await expect(matchFn(match, offer, selectedCurrency, selectedPaymentMethod, updateMessage)).rejects.toThrow()
  })
})
