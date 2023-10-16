import { fireEvent, render, renderHook } from 'test-utils'
import { navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { usePopupStore } from '../store/usePopupStore'
import { useShowHelp } from './useShowHelp'

describe('useShowHelp', () => {
  it('returns function to show help popup', () => {
    const { result } = renderHook(useShowHelp, { initialProps: 'acceptMatch' })
    expect(result.current).toBeInstanceOf(Function)
  })
  it('opens popup with help text', () => {
    const { result } = renderHook(useShowHelp, { initialProps: 'acceptMatch' })
    result.current()
    const popupComponent = usePopupStore.getState().popupComponent || <></>
    expect(render(popupComponent).toJSON()).toMatchSnapshot()
  })
  it('should navigate to contact', () => {
    const { result } = renderHook(useShowHelp, { initialProps: 'acceptMatch' })
    result.current()
    const popupComponent = usePopupStore.getState().popupComponent || <></>
    fireEvent.press(render(popupComponent).getByText('help'))
    expect(navigateMock).toHaveBeenCalledWith('contact')
    expect(usePopupStore.getState().visible).toEqual(false)
  })
})
