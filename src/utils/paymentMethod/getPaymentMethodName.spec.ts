import { getPaymentMethodName } from './getPaymentMethodName'

const getEventNameMock = jest.fn()
jest.mock('../events/getEventName', () => ({
  getEventName: (...args: unknown[]) => getEventNameMock(...args),
}))

describe('getPaymentMethodName', () => {
  it('returns the correct name for cash payment methods', () => {
    const p = 'cash.testEvent'
    const shortName = 'Test'
    const eventName = 'testEvent'
    const expectedName = shortName

    getEventNameMock.mockReturnValue(shortName)

    expect(getPaymentMethodName(p)).toEqual(expectedName)
    expect(getEventNameMock).toHaveBeenCalledWith(eventName)
  })

  it('returns the correct name for non-cash payment methods', () => {
    const p = 'paypal'
    const expectedName = 'PayPal'

    expect(getPaymentMethodName(p)).toEqual(expectedName)
  })
})
