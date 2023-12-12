import { responseUtils } from 'test-utils'
import * as offerData from '../../../../tests/unit/data/offerData'
import { peachAPI } from '../../../utils/peachAPI'
import { getError, getResult } from '../../../utils/result'
import { matchFn } from './matchFn'

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

const matchOfferMock = jest.spyOn(peachAPI.private.offer, 'matchOffer')

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
    matchOfferMock.mockResolvedValueOnce({ error: { error: 'CANNOT_MATCH' }, ...responseUtils })
    await expect(matchFn(match, offer, selectedCurrency, selectedPaymentMethod, updateMessage)).rejects.toThrow()
  })
})
