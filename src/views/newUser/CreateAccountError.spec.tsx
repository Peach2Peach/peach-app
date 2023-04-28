import { fireEvent, render } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { CreateAccountError } from './CreateAccountError'

describe('CreateAccountError', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<CreateAccountError err="UNKNOWN_ERROR" />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should navigate to contact screen', () => {
    const { getByTestId } = render(<CreateAccountError err="UNKNOWN_ERROR" />, { wrapper: NavigationWrapper })

    fireEvent.press(getByTestId('createAccount-contactUs'))
    expect(navigateMock).toHaveBeenCalledWith('contact')
  })
  it('should navigate to restore backup screen', () => {
    const { getByTestId } = render(<CreateAccountError err="UNKNOWN_ERROR" />, { wrapper: NavigationWrapper })

    fireEvent.press(getByTestId('createAccount-restoreBackup'))
    expect(navigateMock).toHaveBeenCalledWith('restoreBackup')
  })
})
