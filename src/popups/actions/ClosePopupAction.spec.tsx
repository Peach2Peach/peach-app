import { toMatchDiffSnapshot } from 'snapshot-diff'
import { fireEvent, render } from 'test-utils'
import { usePopupStore } from '../../store/usePopupStore'
import { ClosePopupAction } from './ClosePopupAction'
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
