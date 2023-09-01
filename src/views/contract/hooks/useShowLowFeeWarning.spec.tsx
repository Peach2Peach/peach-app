import { renderHook } from '@testing-library/react-native'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { MessageContext, defaultMessageState } from '../../../contexts/message'
import { useSettingsStore } from '../../../store/settingsStore'
import { useShowLowFeeWarning } from './useShowLowFeeWarning'

let messageState = defaultMessageState
const updateMessage = jest.fn().mockImplementation((state) => (messageState = state))
const Wrapper = ({ children }: ComponentProps) => (
  <MessageContext.Provider value={[messageState, updateMessage]}>
    <NavigationAndQueryClientWrapper>{children}</NavigationAndQueryClientWrapper>
  </MessageContext.Provider>
)
const wrapper = Wrapper

jest.useFakeTimers()

describe('useShowLowFeeWarning', () => {
  const initialProps = { enabled: true }

  beforeEach(() => {
    messageState = defaultMessageState
    useSettingsStore.getState().setFeeRate(0.99)
  })
  it('should show high fee warning banner if fees are bigger than 10%', () => {
    renderHook(useShowLowFeeWarning, { initialProps, wrapper })
    expect(messageState).toEqual({
      action: {
        callback: expect.any(Function),
        icon: 'settingsGear',
        label: 'change fee',
      },
      bodyArgs: ['1'],
      level: 'WARN',
      msgKey: 'contract.warning.lowFee',
    })
  })
  it('should navigate to fee settings', () => {
    renderHook(useShowLowFeeWarning, { initialProps, wrapper })
    messageState.action?.callback()
    expect(navigateMock).toHaveBeenCalledWith('networkFees')
  })
  it('should not show high fee warning banner if disabled', () => {
    renderHook(useShowLowFeeWarning, {
      initialProps: { enabled: false },
      wrapper,
    })
    expect(messageState).toEqual(defaultMessageState)
  })
  it('should not show high fee warning banner if fees are higher than minimum', () => {
    useSettingsStore.getState().setFeeRate(2)

    renderHook(useShowLowFeeWarning, { initialProps, wrapper })
    expect(messageState).toEqual(defaultMessageState)
  })
})
