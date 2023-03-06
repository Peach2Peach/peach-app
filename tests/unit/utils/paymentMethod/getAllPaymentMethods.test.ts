import { deepStrictEqual } from 'assert'
import { getAllPaymentMethods } from '../../../../src/utils/paymentMethod'

describe('getAllPaymentMethods', () => {
  const paymentCategories: PaymentCategories = {
    bankTransfer: ['sepa', 'instantSepa', 'fasterPayments'],
    onlineWallet: ['paypal', 'revolut', 'wise'],
    localOption: ['mbWay', 'bizum', 'satispay', 'mobilePay'],
    giftCard: [],
    cash: [],
    cryptoCurrency: [],
  }
  it('returns all payment methods', () => {
    deepStrictEqual(getAllPaymentMethods(paymentCategories), [
      'sepa',
      'instantSepa',
      'fasterPayments',
      'paypal',
      'revolut',
      'wise',
      'mbWay',
      'bizum',
      'satispay',
      'mobilePay',
    ])
  })
})
