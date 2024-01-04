import { fireEvent, render, renderHook } from 'test-utils'
import { PopupLoadingSpinner } from '../../tests/unit/helpers/PopupLoadingSpinner'
import { Popup, PopupAction } from '../components/popup'
import { PopupComponent } from '../components/popup/PopupComponent'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { useShowLoadingPopup } from './useShowLoadingPopup'

describe('useShowLoadingPopup', () => {
  it('returns function to show loading popup', () => {
    const { result } = renderHook(useShowLoadingPopup)
    expect(result.current).toBeInstanceOf(Function)
  })
  it('opens default popup with loading animation', () => {
    const { result } = renderHook(useShowLoadingPopup)
    result.current()

    expect(usePopupStore.getState().visible).toEqual(true)
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <PopupComponent
        title={i18n('loading')}
        content={PopupLoadingSpinner}
        actions={<PopupAction label={i18n('loading')} iconId="clock" onPress={expect.any(Function)} />}
      />,
    )
  })
  it('action callback does not close popup', () => {
    const { result } = renderHook(useShowLoadingPopup)
    result.current()
    const { getAllByText } = render(<Popup />)
    fireEvent.press(getAllByText('loading...')[1])
    expect(usePopupStore.getState().visible).toEqual(true)
  })
  it('respects passed options', () => {
    const title = 'title'
    const { result } = renderHook(useShowLoadingPopup)
    result.current({
      title,
    })

    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <PopupComponent
        title={title}
        content={PopupLoadingSpinner}
        actions={<PopupAction label={i18n('loading')} iconId="clock" onPress={expect.any(Function)} />}
      />,
    )
  })
})
