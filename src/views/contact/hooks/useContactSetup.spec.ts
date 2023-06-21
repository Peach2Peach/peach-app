import { renderHook } from '@testing-library/react-native'
import { DISCORD, TELEGRAM } from '../../../constants'
import { setAccount } from '../../../utils/account'
import { contactReasonsNoAccount, contactReasonsWithAccount, useContactSetup } from './useContactSetup'

const navigateMock = jest.fn()
jest.mock('../../../hooks', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
  useHeaderSetup: jest.fn(),
}))

const openURLMock = jest.fn()
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: (url: string) => openURLMock(url),
}))

describe('useContactSetup', () => {
  it('should return the correct default values', () => {
    const { result } = renderHook(() => useContactSetup())
    expect(result.current).toStrictEqual({
      contactReasons: contactReasonsNoAccount,
      setReason: expect.any(Function),
      openTelegram: expect.any(Function),
      openDiscord: expect.any(Function),
    })
  })

  it('should return the correct default values when there is an account', () => {
    setAccount({ publicKey: 'test' } as Account)
    jest.mock('../../../utils/account', () => ({
      account: null,
    }))
    const { result } = renderHook(() => useContactSetup())
    expect(result.current).toStrictEqual({
      contactReasons: contactReasonsWithAccount,
      setReason: expect.any(Function),
      openTelegram: expect.any(Function),
      openDiscord: expect.any(Function),
    })
  })

  it('should open telegram', () => {
    const { result } = renderHook(() => useContactSetup())
    result.current.openTelegram()
    expect(openURLMock).toHaveBeenCalledWith(TELEGRAM)
  })

  it('should open discord', () => {
    const { result } = renderHook(() => useContactSetup())
    result.current.openDiscord()
    expect(openURLMock).toHaveBeenCalledWith(DISCORD)
  })

  it('should navigate to report', () => {
    const { result } = renderHook(() => useContactSetup())
    result.current.setReason('bug')
    expect(navigateMock).toHaveBeenCalledWith('report', { reason: 'bug', shareDeviceID: false })
  })

  it('should share the device id when the account is lost', () => {
    const { result } = renderHook(() => useContactSetup())
    result.current.setReason('accountLost')
    expect(navigateMock).toHaveBeenCalledWith('report', { reason: 'accountLost', shareDeviceID: true })
  })
})
