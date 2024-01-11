import { renderHook } from 'test-utils'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { defaultState, useMessageState } from '../../../components/message/useMessageState'
import { useSettingsStore } from '../../../store/settingsStore/useSettingsStore'
import { useShowLowFeeWarning } from './useShowLowFeeWarning'

jest.useFakeTimers()

describe('useShowLowFeeWarning', () => {
  const initialProps = { enabled: true }

  beforeEach(() => {
    useMessageState.setState(defaultState)
    useSettingsStore.getState().setFeeRate(0.99)
  })
  it('should show high fee warning banner if fees are bigger than 10%', () => {
    renderHook(useShowLowFeeWarning, { initialProps })
    expect(useMessageState.getState()).toEqual(
      expect.objectContaining({
        action: {
          callback: expect.any(Function),
          icon: 'settings',
          label: 'change fee',
        },
        bodyArgs: ['1'],
        level: 'WARN',
        msgKey: 'contract.warning.lowFee',
      }),
    )
  })
  it('should navigate to fee settings', () => {
    renderHook(useShowLowFeeWarning, { initialProps })
    useMessageState.getState().action?.callback()
    expect(navigateMock).toHaveBeenCalledWith('networkFees')
  })
  it('should not show high fee warning banner if disabled', () => {
    renderHook(useShowLowFeeWarning, {
      initialProps: { enabled: false },
    })
    expect(useMessageState.getState()).toEqual(expect.objectContaining(defaultState))
  })
  it('should not show high fee warning banner if fees are higher than minimum', () => {
    useSettingsStore.getState().setFeeRate(2)

    renderHook(useShowLowFeeWarning, { initialProps })
    expect(useMessageState.getState()).toEqual(expect.objectContaining(defaultState))
  })
})
