import { ClosePopupAction } from './ClosePopupAction'
import { render, fireEvent } from '@testing-library/react-native'
import { usePopupStore } from '../../store/usePopupStore'
import { toMatchDiffSnapshot } from 'snapshot-diff'
expect.extend({ toMatchDiffSnapshot })

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
  it('should render correctly with custom text style', () => {
    const { toJSON } = render(<ClosePopupAction textStyle={{ color: 'red' }} />)
    expect(render(<ClosePopupAction />).toJSON()).toMatchDiffSnapshot(toJSON())
  })
})
