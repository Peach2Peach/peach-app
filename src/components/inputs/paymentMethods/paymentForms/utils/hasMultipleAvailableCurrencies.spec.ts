import { setPaymentMethods } from '../../../../../paymentMethods'
import { hasMultipleAvailableCurrencies } from './hasMultipleAvailableCurrencies'

describe('hasMultipleAvailableCurrencies', () => {
  const paymentMethodsWithMultipleCurrencies = [
    {
      id: 'skrill' as const,
      anonymous: false,
      currencies: ['EUR', 'USD'] satisfies Currency[],
    },
    {
      id: 'neteller' as const,
      anonymous: false,
      currencies: ['EUR', 'USD'] satisfies Currency[],
    },
    {
      id: 'paypal' as const,
      anonymous: false,
      currencies: ['EUR', 'USD'] satisfies Currency[],
    },
  ]

  const paymentMethodsWithSingleCurrency = [
    {
      id: 'sepa' as const,
      anonymous: false,
      currencies: ['EUR'] satisfies Currency[],
    },
    {
      id: 'instantSepa' as const,
      anonymous: false,
      currencies: ['EUR'] satisfies Currency[],
    },
  ]

  beforeAll(() => {
    setPaymentMethods([...paymentMethodsWithMultipleCurrencies, ...paymentMethodsWithSingleCurrency])
  })

  it('should return true for any pm with multips currencies defined in PAYMENTMETHODINFOS', () => {
    paymentMethodsWithMultipleCurrencies.forEach((pm) => {
      expect(hasMultipleAvailableCurrencies(pm.id)).toBe(true)
    })
  })

  it('should return false for any pm with single currency defined in PAYMENTMETHODINFOS', () => {
    paymentMethodsWithSingleCurrency.forEach((pm) => {
      expect(hasMultipleAvailableCurrencies(pm.id)).toBe(false)
    })
  })

  it('should return false for any pm not defined in PAYMENTMETHODINFOS', () => {
    // @ts-expect-error testing invalid input
    expect(hasMultipleAvailableCurrencies('notExisting')).toBe(false)
  })
})
