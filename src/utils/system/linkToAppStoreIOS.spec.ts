import { Linking } from 'react-native'
import { linkToAppStoreIOS } from './linkToAppStoreIOS'

describe('linkToAppStoreIOS', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('opens the correct URL when "itms-beta://" can be opened', async () => {
    (<jest.Mock>Linking.canOpenURL).mockResolvedValueOnce(true)
    await linkToAppStoreIOS()
    expect(Linking.openURL).toHaveBeenCalledWith('https://beta.itunes.apple.com/v1/app/1619331312')
  })

  it('does not open a URL when "itms-beta://" cannot be opened', async () => {
    (<jest.Mock>Linking.canOpenURL).mockResolvedValueOnce(false)
    await linkToAppStoreIOS()
    expect(Linking.openURL).not.toHaveBeenCalled()
  })
})
