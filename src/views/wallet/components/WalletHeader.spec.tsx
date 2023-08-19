import { fireEvent, render } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { WalletHeader } from './WalletHeader'

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
  it('should go to address checker', () => {
    const { getByAccessibilityHint } = render(<WalletHeader />, { wrapper })

    fireEvent.press(getByAccessibilityHint('go to address checker'))
    expect(navigateMock).toHaveBeenCalledWith('addressChecker')
  })
})
