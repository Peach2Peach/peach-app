import messaging from '@react-native-firebase/messaging'
import { Linking } from 'react-native'
import { toggleNotificationsIOS } from '../../../../src/utils/system'
import { hasPermissionMock, requestPermissionMock } from '../../prepare'

jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
  },
}))

describe('toggleNotificationsIOS', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('requests permission when notification authorization is not determined', async () => {
    hasPermissionMock.mockResolvedValueOnce(messaging.AuthorizationStatus.NOT_DETERMINED)
    await toggleNotificationsIOS()
    expect(requestPermissionMock).toHaveBeenCalledWith({
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
