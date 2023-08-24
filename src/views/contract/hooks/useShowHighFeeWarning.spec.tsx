import { renderHook } from '@testing-library/react-native'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { MessageContext, defaultMessageState } from '../../../contexts/message'
import { useSettingsStore } from '../../../store/settingsStore'
import { useShowHighFeeWarning } from './useShowHighFeeWarning'

let messageState = defaultMessageState
const updateMessage = jest.fn().mockImplementation((state) => (messageState = state))
const Wrapper = ({ children }: ComponentProps) => (
  <MessageContext.Provider value={[messageState, updateMessage]}>
    <NavigationAndQueryClientWrapper>{children}</NavigationAndQueryClientWrapper>
  </MessageContext.Provider>
)
const wrapper = Wrapper

jest.useFakeTimers()

describe('useShowHighFeeWarning', () => {
  const initialProps = {
    enabled: true,
    amount: 173000,
  }

  beforeEach(() => {
    messageState = defaultMessageState
    useSettingsStore.getState().setFeeRate(100)
  })
  it('should show high fee warning banner if fees are bigger than 10%', () => {
    renderHook(useShowHighFeeWarning, { initialProps, wrapper })
    expect(messageState).toEqual({
      action: {
        callback: expect.any(Function),
        icon: 'settingsGear',
        label: 'change fee',
      },
      bodyArgs: ['100', '10.0'],
      level: 'WARN',
      msgKey: 'contract.warning.highFee',
    })
  })
  it('should navigate to fee settings', () => {
    renderHook(useShowHighFeeWarning, { initialProps, wrapper })
    messageState.action?.callback()
    expect(navigateMock).toHaveBeenCalledWith('networkFees')
  })
  it('should not show high fee warning banner if disabled', () => {
    renderHook(useShowHighFeeWarning, {
      initialProps: {
        enabled: false,
        amount: 100000,
      },
      wrapper,
    })
    expect(messageState).toEqual(defaultMessageState)
  })
  it('should not show high fee warning banner if fees are lower than 10%', () => {
    renderHook(useShowHighFeeWarning, {
      initialProps: {
        enabled: true,
        amount: 173001,
      },
      wrapper,
    })
    expect(messageState).toEqual(defaultMessageState)
  })
  it('should not show high fee warning banner if no amount is passed', () => {
    renderHook(useShowHighFeeWarning, {
      initialProps: {
        enabled: true,
        amount: undefined,
      },
      wrapper,
    })
    expect(messageState).toEqual(defaultMessageState)
  })
})
