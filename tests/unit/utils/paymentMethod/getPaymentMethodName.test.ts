import { getEventName } from '../../../../src/utils/events'
import { getPaymentMethodName } from '../../../../src/utils/paymentMethod'
import { sessionStorage } from '../../../../src/utils/session'

jest.mock('../../../../src/utils/events', () => ({
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
