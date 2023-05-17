import { fireEvent, render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import BitcoinProducts from './BitcoinProducts'
import { Linking } from 'react-native'

jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
  },
}))

describe('BitcoinProducts', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<BitcoinProducts />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should link to bitbox', () => {
    const { getByText } = render(<BitcoinProducts />, { wrapper: NavigationWrapper })
    fireEvent(getByText('check out bitbox'), 'onPress')
    expect(Linking.openURL).toHaveBeenCalledWith('https://shiftcrypto.ch/bitbox02/?ref=DLX6l9ccCc')
  })
})
