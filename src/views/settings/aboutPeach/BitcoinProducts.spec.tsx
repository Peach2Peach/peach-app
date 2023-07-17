import { fireEvent, render } from '@testing-library/react-native'
import { Linking } from 'react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { BitcoinProducts } from './BitcoinProducts'

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: jest.fn(),
}))

describe('BitcoinProducts', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<BitcoinProducts />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should link to bitbox', () => {
    const openURLSpy = jest.spyOn(Linking, 'openURL')
    const { getByText } = render(<BitcoinProducts />, { wrapper: NavigationWrapper })
    fireEvent(getByText('check out bitbox'), 'onPress')
    expect(openURLSpy).toHaveBeenCalledWith('https://bitbox.swiss/bitbox02/?ref=DLX6l9ccCc')
  })
})
