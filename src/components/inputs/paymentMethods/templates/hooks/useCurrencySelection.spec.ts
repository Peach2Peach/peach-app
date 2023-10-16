import { act, renderHook } from 'test-utils'
import { setPaymentMethods } from '../../../../../paymentMethods'
import { useCurrencySelection } from './useCurrencySelection'

describe('useCurrencySelection', () => {
  const defaultProps = {
    currencies: ['USD', 'EUR', 'GBP'],
    type: 'paypal',
  } satisfies { type: PaymentMethod; currencies: Currency[] }

  beforeAll(() => {
    setPaymentMethods([
      {
        id: 'paypal',
        currencies: ['USD', 'EUR', 'GBP'],
        anonymous: false,
      },
      {
        id: 'sepa',
        currencies: ['EUR'],
        anonymous: false,
      },
    ])
  })

  it('should return the correct values', () => {
    const { result } = renderHook(useCurrencySelection, { initialProps: defaultProps })
    expect(result.current.selectedCurrencies).toEqual(defaultProps.currencies)
    expect(result.current.shouldShowCurrencySelection).toBe(true)
  })

  it('should return the correct values when the payment method is not supported', () => {
    const { result } = renderHook(useCurrencySelection, { initialProps: { currencies: ['EUR'], type: 'sepa' } })

    expect(result.current.selectedCurrencies).toEqual(['EUR'])
    expect(result.current.shouldShowCurrencySelection).toBe(false)
  })

  it('should update the selected currencies when a currency is toggled', () => {
    const { result } = renderHook(useCurrencySelection, { initialProps: defaultProps })

    expect(result.current.selectedCurrencies).toEqual(defaultProps.currencies)

    act(() => {
      result.current.currencySelectionProps.onToggle('USD')
    })

    expect(result.current.selectedCurrencies).toEqual(['EUR', 'GBP'])

    act(() => {
      result.current.currencySelectionProps.onToggle('EUR')
    })

    expect(result.current.selectedCurrencies).toEqual(['GBP'])

    act(() => {
      result.current.currencySelectionProps.onToggle('EUR')
    })

    expect(result.current.selectedCurrencies).toEqual(['GBP', 'EUR'])
  })
})
