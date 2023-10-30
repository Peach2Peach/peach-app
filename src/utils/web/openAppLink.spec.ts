import { Linking } from 'react-native'
import { openAppLink } from '.'

describe('openAppLink', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should open the app link if it is available', async () => {
    const appLink = 'app://'
    const fallbackUrl = 'http://fallback.com'
    const canOpenStub = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true)
    const openStub = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined)

    await openAppLink(fallbackUrl, appLink)

    expect(canOpenStub).toHaveBeenCalledWith(appLink)
    expect(openStub).toHaveBeenCalledWith(appLink)
  })

  it('should open the fallback url if the app link is not available', async () => {
    const appLink = 'app://'
    const fallbackUrl = 'http://fallback.com'
    const canOpenStub = jest
      .spyOn(Linking, 'canOpenURL')
      .mockImplementation((url: string) => Promise.resolve(url === fallbackUrl))
    const openStub = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined)

    await openAppLink(fallbackUrl, appLink)

    expect(canOpenStub).toHaveBeenCalledWith(appLink)
    expect(canOpenStub).toHaveBeenCalledWith(fallbackUrl)
    expect(openStub).toHaveBeenCalledWith(fallbackUrl)
  })

  it('should open the fallback url', async () => {
    const fallbackUrl = 'http://fallback.com'
    jest.spyOn(Linking, 'canOpenURL').mockImplementation((url: string) => Promise.resolve(url === fallbackUrl))
    const openStub = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined)

    await openAppLink(fallbackUrl)

    expect(openStub).toHaveBeenCalledWith(fallbackUrl)
  })
})
