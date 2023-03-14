import { getEventName } from '../events'
import { getPaymentMethodName } from '.'
import { sessionStorage } from '../session'

jest.mock('../events', () => ({
  getEventName: jest.fn(),
}))

describe('getPaymentMethodName', () => {
  it('returns the correct name for cash payment methods', () => {
    const p = 'cash.testEvent'
    const shortName = 'Test'
    const eventName = 'testEvent'
    const expectedName = shortName
    const mockMap = [{ id: eventName, shortName }]

    sessionStorage.setMap('meetupEvents', mockMap)
    ;(getEventName as jest.Mock).mockReturnValue(shortName)

    expect(getPaymentMethodName(p)).toEqual(expectedName)
    expect(getEventName).toHaveBeenCalledWith(eventName)
  })

  it('returns the correct name for non-cash payment methods', () => {
    const p = 'paypal'
    const expectedName = 'PayPal'

    expect(getPaymentMethodName(p)).toEqual(expectedName)
  })
})
