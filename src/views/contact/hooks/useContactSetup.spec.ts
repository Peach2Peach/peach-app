import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-test-renderer'
import { account1 } from '../../../../tests/unit/data/accountData'
import { DISCORD, TELEGRAM } from '../../../constants'
import { setAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'

import { contactReasonsWithAccount, contactReasonsNoAccount, useContactSetup } from './useContactSetup'

const navigationNavigateMock = jest.fn()
const useNavigationMock = jest.fn(() => ({
  navigate: navigationNavigateMock,
}))
const useHeaderSetupMock = jest.fn()
jest.mock('../../../hooks', () => ({
  useNavigation: () => useNavigationMock(),
  useHeaderSetup: (...args: any[]) => useHeaderSetupMock(...args),
}))

const openURLMock = jest.fn()
jest.mock('react-native', () => ({
  Linking: {
    openURL: (args: any) => openURLMock(args),
  },
}))

describe('useContactSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('return default values for when user has no account', () => {
    const { result } = renderHook(useContactSetup)

    expect(result.current.contactReasons).toEqual(contactReasonsNoAccount)
    expect(result.current.setReason).toBeInstanceOf(Function)
    expect(result.current.openTelegram).toBeInstanceOf(Function)
    expect(result.current.openDiscord).toBeInstanceOf(Function)
  })
  it('return contact reasons when user has account', () => {
    setAccount(account1)
    const { result } = renderHook(useContactSetup)

    expect(result.current.contactReasons).toEqual(contactReasonsWithAccount)
  })
  it('should add the correct header', () => {
    renderHook(useContactSetup)

    expect(useHeaderSetupMock).toHaveBeenCalled()
    const args = useHeaderSetupMock.mock.calls[0][0]
    expect(args.title).toBe(i18n('contact.title'))
  })

  it('choosing a reason navigates to report', () => {
    const reason = 'bug'
    const { result } = renderHook(useContactSetup)

    act(() => {
      result.current.setReason(reason)
    })
    expect(navigationNavigateMock).toHaveBeenCalledWith('report', { reason, shareDeviceID: false })
  })
  it('choosing a lostAccount reason navigates to report with checkbox prechecked', () => {
    const reason = 'accountLost'
    const { result } = renderHook(useContactSetup)

    act(() => {
      result.current.setReason(reason)
    })
    expect(navigationNavigateMock).toHaveBeenCalledWith('report', { reason, shareDeviceID: true })
  })
  it('links to telegram', () => {
    const { result } = renderHook(useContactSetup)

    act(() => {
      result.current.openTelegram()
    })
    expect(openURLMock).toHaveBeenCalledWith(TELEGRAM)
  })
  it('links to discord', () => {
    const { result } = renderHook(useContactSetup)

    act(() => {
      result.current.openDiscord()
    })
    expect(openURLMock).toHaveBeenCalledWith(DISCORD)
  })
})
