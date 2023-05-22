import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../components/header/store'
import { goToHomepage } from '../../utils/web'
import { useOnboardingHeader } from './useOnboardingHeader'

const wrapper = NavigationWrapper

describe('useOnboardingHeader', () => {
  it('should set up the header correctly', () => {
    const title = 'a title'
    renderHook(useOnboardingHeader, {
      initialProps: {
        title,
      },
      wrapper,
    })

    expect(useHeaderState.getState().title).toBe(title)
    expect(useHeaderState.getState().hideGoBackButton).toBe(false)
    expect(useHeaderState.getState().icons?.[0].id).toBe('mail')
    expect(useHeaderState.getState().icons?.[0].color).toBe('#FFFCFA')
    expect(useHeaderState.getState().icons?.[0].onPress).toBeInstanceOf(Function)
    expect(useHeaderState.getState().icons?.[1].id).toBe('globe')
    expect(useHeaderState.getState().icons?.[1].color).toBe('#FFFCFA')
    expect(useHeaderState.getState().icons?.[1].onPress).toEqual(goToHomepage)
    expect(useHeaderState.getState().theme).toBe('inverted')
  })
  it('allows overwriting values', () => {
    const title = 'a title'
    renderHook(useOnboardingHeader, {
      initialProps: {
        title,
        hideGoBackButton: true,
        icons: [],
      },
      wrapper,
    })

    expect(useHeaderState.getState().title).toBe(title)
    expect(useHeaderState.getState().hideGoBackButton).toBe(true)
    expect(useHeaderState.getState().icons).toHaveLength(0)
  })
  it('should navigate to contact', () => {
    const title = 'a title'
    renderHook(useOnboardingHeader, { initialProps: { title }, wrapper })

    useHeaderState.getState().icons?.[0].onPress()

    expect(navigateMock).toHaveBeenCalledWith('contact')
  })
})
