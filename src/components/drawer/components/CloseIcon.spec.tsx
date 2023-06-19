import { fireEvent, render } from '@testing-library/react-native'
import Icon from '../../Icon'
import { CloseIcon } from './CloseIcon'

describe('CloseIcon', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<CloseIcon closeDrawer={() => {}} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should call closeDrawer when pressed', () => {
    const closeDrawer = jest.fn()
    const { UNSAFE_getByType } = render(<CloseIcon closeDrawer={closeDrawer} />)
    fireEvent.press(UNSAFE_getByType(Icon))
    expect(closeDrawer).toHaveBeenCalled()
  })
})
