import { fireEvent, render, renderHook } from '@testing-library/react-native'
import { NavigationWrapper, headerState, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { WithdrawingFundsHelp } from '../../../popups/info/WithdrawingFundsHelp'
import { usePopupStore } from '../../../store/usePopupStore'
import { useWalletHeaderSetup } from './useWalletHeaderSetup'

jest.useFakeTimers()

const wrapper = NavigationWrapper

describe('useWalletHeaderSetup', () => {
  it('should set up correctly while loading', () => {
    renderHook(() => useWalletHeaderSetup(true), { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should set up correctly when loaded', () => {
    renderHook(() => useWalletHeaderSetup(false), { wrapper })
    expect(headerState.header()).toMatchSnapshot()

    const { getByAccessibilityHint } = render(headerState.header(), { wrapper })

    fireEvent.press(getByAccessibilityHint('go to transaction history'))
    expect(navigateMock).toHaveBeenCalledWith('transactionHistory')

    fireEvent.press(getByAccessibilityHint('help'))
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'sending funds',
      content: <WithdrawingFundsHelp />,
    })
  })
  it.todo('should go to address checker')
})
