import messaging from '@react-native-firebase/messaging'
import { Linking } from 'react-native'
import { toggleNotificationsIOS } from '.'

jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
  },
}))

describe('toggleNotificationsIOS', () => {
  const hasPermissionMock = jest.spyOn(messaging(), 'hasPermission')
  it('requests permission when notification authorization is not determined', async () => {
    hasPermissionMock.mockResolvedValueOnce(messaging.AuthorizationStatus.NOT_DETERMINED)
    const requestPermission = jest.spyOn(messaging(), 'requestPermission')
    await toggleNotificationsIOS()
    expect(requestPermission).toHaveBeenCalledWith({
      alert: true,
      badge: false,
      sound: true,
    })
  })

  it('opens the settings page when notification authorization is determined', async () => {
    hasPermissionMock.mockResolvedValueOnce(messaging.AuthorizationStatus.AUTHORIZED)
    await toggleNotificationsIOS()
    expect(Linking.openURL).toHaveBeenCalledWith('app-settings://')
  })
})
