import { checkNotifications } from 'react-native-permissions'
import { checkNotificationStatusAndroid } from './checkNotificationStatusAndroid'

jest.mock('react-native-permissions', () => ({
  checkNotifications: jest.fn(),
}))

describe('checkNotificationStatusAndroid', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns true if notifications are enabled', async () => {
    ;(<jest.Mock>checkNotifications).mockResolvedValue({ status: 'granted' })

    const result = await checkNotificationStatusAndroid()
    expect(result).toBe(true)

    expect(checkNotifications).toHaveBeenCalled()
  })

  it('returns false if notifications are unavailable', async () => {
    ;(<jest.Mock>checkNotifications).mockResolvedValue({ status: 'unavailable' })

    const result = await checkNotificationStatusAndroid()
    expect(result).toBe(false)

    expect(checkNotifications).toHaveBeenCalled()
  })
  it('returns false if notifications are denied', async () => {
    ;(<jest.Mock>checkNotifications).mockResolvedValue({ status: 'denied' })

    const result = await checkNotificationStatusAndroid()
    expect(result).toBe(false)

    expect(checkNotifications).toHaveBeenCalled()
  })
  it('returns false if notifications are blocked', async () => {
    ;(<jest.Mock>checkNotifications).mockResolvedValue({ status: 'blocked' })

    const result = await checkNotificationStatusAndroid()
    expect(result).toBe(false)

    expect(checkNotifications).toHaveBeenCalled()
  })
  it('returns false if notifications are limited', async () => {
    ;(<jest.Mock>checkNotifications).mockResolvedValue({ status: 'limited' })

    const result = await checkNotificationStatusAndroid()
    expect(result).toBe(false)

    expect(checkNotifications).toHaveBeenCalled()
  })
})
