import { fireEvent, render } from '@testing-library/react-native'
import { WalletHeader } from './WalletHeader'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { usePopupStore } from '../../../store/usePopupStore'
import { WithdrawingFundsHelp } from '../../../popups/info/WithdrawingFundsHelp'

const wrapper = NavigationWrapper

describe('WalletHeader', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<WalletHeader />, { wrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should go to transaction history', () => {
    const { getByAccessibilityHint } = render(<WalletHeader />, { wrapper })

    fireEvent.press(getByAccessibilityHint('go to transaction history'))
    expect(navigateMock).toHaveBeenCalledWith('transactionHistory')
  })
  it('should show help', () => {
    const { getByAccessibilityHint } = render(<WalletHeader />, { wrapper })

    fireEvent.press(getByAccessibilityHint('help'))
    expect(usePopupStore.getState()).toEqual(
      expect.objectContaining({
        title: 'sending funds',
        content: <WithdrawingFundsHelp />,
      }),
    )
  })
  it.todo('should go to address checker')
})
