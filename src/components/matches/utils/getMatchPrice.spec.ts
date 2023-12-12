import { getMatchPrice } from './getMatchPrice'

const getPaymentMethodInfoMock = jest.fn()
jest.mock('../../../utils/paymentMethod/getPaymentMethodInfo', () => ({
  getPaymentMethodInfo: (...args: unknown[]) => getPaymentMethodInfoMock(...args),
}))

// eslint-disable-next-line max-lines-per-function
describe('getMatchPrice', () => {
  beforeEach(() => {
    getPaymentMethodInfoMock.mockClear()
  })

  it('should return the matched price if it exists and the match is matched', () => {
    const match = {
      matched: true,
      matchedPrice: 0,
      prices: {
        USD: 200,
      },
    } as Match

    expect(getMatchPrice(match, undefined, 'USD')).toEqual(0)
  })

  it('should return the price of the selected currency if the match is matched but the matched price is null', () => {
    const match = {
      matched: true,
      matchedPrice: null,
      prices: {
        USD: 200,
      },
    } as Match

    expect(getMatchPrice(match, undefined, 'USD')).toEqual(200)
  })

  it('should get the payment method info if the selected payment method is defined', () => {
    const match = {
      matched: true,
      matchedPrice: 0,
      prices: {
        USD: 200,
      },
    } as Match

    getMatchPrice(match, 'paypal', 'USD')

    expect(getPaymentMethodInfoMock).toHaveBeenCalledWith('paypal')
  })

  it('should return the price of the selected currency if the match is not matched', () => {
    const match = {
      matched: false,
      matchedPrice: 0,
      prices: {
        USD: 200,
      },
    } as Match

    expect(getMatchPrice(match, undefined, 'USD')).toEqual(200)
  })

  it('should round the price if the payment method is rounded', () => {
    const match = {
      matched: false,
      matchedPrice: 0,
      prices: {
        USD: 200.5,
      },
    } as Match

    getPaymentMethodInfoMock.mockReturnValue({
      id: 'paypal',
      rounded: true,
    })

    expect(getMatchPrice(match, 'paypal', 'USD')).toEqual(201)
  })

  it('should not round the price if the payment method is not rounded', () => {
    const match = {
      matched: false,
      matchedPrice: 0,
      prices: {
        USD: 200.5,
      },
    } as Match

    getPaymentMethodInfoMock.mockReturnValue({
      id: 'paypal',
      rounded: false,
    })

    expect(getMatchPrice(match, 'paypal', 'USD')).toEqual(200.5)
  })

  it('should return 0 if the price is undefined and the payment method is rounded', () => {
    const match = {
      matched: false,
      matchedPrice: 10,
      prices: {},
    } as Match

    getPaymentMethodInfoMock.mockReturnValueOnce({
      id: 'paypal',
      rounded: true,
    })

    expect(getMatchPrice(match, 'paypal', 'USD')).toEqual(0)
  })

  it('should return 0 if the price is undefined and the payment method is not rounded', () => {
    const match = {
      matched: false,
      matchedPrice: 10,
      prices: {},
    } as Match

    getPaymentMethodInfoMock.mockReturnValueOnce({
      id: 'paypal',
      rounded: false,
    })

    expect(getMatchPrice(match, 'paypal', 'USD')).toEqual(0)
  })
})
