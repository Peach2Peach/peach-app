import { toggleNotificationsAndroid } from './toggleNotificationsAndroid'
import { Linking } from 'react-native'

jest.mock('react-native', () => ({
  Linking: {
    openSettings: jest.fn(),
  },
}))

describe('toggleNotifications', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('calls Linking.openSettings', async () => {
    await toggleNotificationsAndroid()
    expect(Linking.openSettings).toHaveBeenCalled()
  })
})
