import { fireEvent, render } from 'test-utils'
import { navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { CreateAccountError } from './CreateAccountError'

describe('CreateAccountError', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<CreateAccountError err="UNKNOWN_ERROR" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should navigate to contact screen', () => {
    const { getByTestId } = render(<CreateAccountError err="UNKNOWN_ERROR" />)

    fireEvent.press(getByTestId('createAccount-contactUs'))
    expect(navigateMock).toHaveBeenCalledWith('contact')
  })
  it('should navigate to restore backup screen', () => {
    const { getByTestId } = render(<CreateAccountError err="UNKNOWN_ERROR" />)

    fireEvent.press(getByTestId('createAccount-restoreBackup'))
    expect(navigateMock).toHaveBeenCalledWith('restoreBackup')
  })
})
