import { fireEvent, render } from 'test-utils'
import { Popup } from '../components/popup/Popup'
import { AppPopup } from './AppPopup'

describe('AppPopup', () => {
  it('should close the popup', () => {
    const { getByText } = render(<AppPopup id="matchUndone" />)
    fireEvent.press(getByText('close'))
    const { queryByText } = render(<Popup />)
    expect(queryByText('match undone')).toBeFalsy()
  })
})
