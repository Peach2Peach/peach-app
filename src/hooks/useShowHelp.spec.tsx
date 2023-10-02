import { fireEvent, render, renderHook } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { usePopupStore } from '../store/usePopupStore'
import { useShowHelp } from './useShowHelp'

describe('useShowHelp', () => {
  it('returns function to show help popup', () => {
    const { result } = renderHook(useShowHelp, { wrapper: NavigationWrapper, initialProps: 'acceptMatch' })
    expect(result.current).toBeInstanceOf(Function)
  })
  it('opens popup with help text', () => {
    const { result } = renderHook(useShowHelp, { wrapper: NavigationWrapper, initialProps: 'acceptMatch' })
    result.current()
    const popupComponent = usePopupStore.getState().popupComponent || <></>
    expect(render(popupComponent, { wrapper: NavigationWrapper }).toJSON()).toMatchSnapshot()
  })
  it('should navigate to contact', () => {
    const { result } = renderHook(useShowHelp, { wrapper: NavigationWrapper, initialProps: 'acceptMatch' })
    result.current()
    const popupComponent = usePopupStore.getState().popupComponent || <></>
    fireEvent.press(render(popupComponent, { wrapper: NavigationWrapper }).getByText('help'))
    expect(navigateMock).toHaveBeenCalledWith('contact')
    expect(usePopupStore.getState().visible).toEqual(false)
  })
})
