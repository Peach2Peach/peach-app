import { checkNotificationStatusAndroid } from './checkNotificationStatusAndroid'

describe('checkNotificationStatusAndroid', () => {
  const checkNotifications = jest.spyOn(require('react-native-permissions'), 'checkNotifications')
  it('returns true if notifications are enabled', async () => {
    checkNotifications.mockResolvedValueOnce({ status: 'granted' })

    const result = await checkNotificationStatusAndroid()
    expect(result).toBe(true)

    expect(checkNotifications).toHaveBeenCalled()
  })

  it('returns false if notifications are unavailable', async () => {
    checkNotifications.mockResolvedValueOnce({ status: 'unavailable' })

    const result = await checkNotificationStatusAndroid()
    expect(result).toBe(false)

    expect(checkNotifications).toHaveBeenCalled()
  })
  it('returns false if notifications are denied', async () => {
    checkNotifications.mockResolvedValueOnce({ status: 'denied' })

    const result = await checkNotificationStatusAndroid()
    expect(result).toBe(false)

    expect(checkNotifications).toHaveBeenCalled()
  })
  it('returns false if notifications are blocked', async () => {
    checkNotifications.mockResolvedValueOnce({ status: 'blocked' })

    const result = await checkNotificationStatusAndroid()
    expect(result).toBe(false)

    expect(checkNotifications).toHaveBeenCalled()
  })
  it('returns false if notifications are limited', async () => {
    checkNotifications.mockResolvedValueOnce({ status: 'limited' })

    const result = await checkNotificationStatusAndroid()
    expect(result).toBe(false)

    expect(checkNotifications).toHaveBeenCalled()
  })
})
