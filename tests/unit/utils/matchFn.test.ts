import { matchFn } from '../../../src/components/matches/utils'
import * as offerData from '../data/offerData'

const selectedCurrency: Currency = 'EUR'
const selectedPaymentMethod: PaymentMethod = 'sepa'

const match = offerData.matchOffer
const offer = offerData.sellOffer

const updateMessage = jest.fn()

describe('matchFn', () => {
  it('should return the result if successful', async () => {
    const result = await matchFn(match, offer, selectedCurrency, selectedPaymentMethod, updateMessage)
    expect(result).toBeDefined()
  })

  it('should throw an error if no offer id', async () => {
    const offerWithoutId = { ...offer, id: undefined }
    await expect(
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
    const matchOfferData = 'Missing paymentData hash'
    await expect(matchFn(match, offer, selectedCurrency, selectedPaymentMethod, updateMessage)).rejects.toThrow(
      matchOfferData,
    )
  })
})
