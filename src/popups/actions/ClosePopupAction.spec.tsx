import { ClosePopupAction } from './ClosePopupAction'
import { render, fireEvent } from '@testing-library/react-native'
import { usePopupStore } from '../../store/usePopupStore'

describe('ClosePopupAction', () => {
  it('should call closePopup when pressed', () => {
    const closePopupMock = jest.fn()
    usePopupStore.setState({ closePopup: closePopupMock })
    const { getByText } = render(<ClosePopupAction />)
    fireEvent.press(getByText('close'))
    expect(closePopupMock).toHaveBeenCalled()
  })
  it('should render correctly', () => {
    const { toJSON } = render(<ClosePopupAction />)
    expect(toJSON()).toMatchSnapshot()
  })
})
