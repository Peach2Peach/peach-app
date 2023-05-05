import { NavigationContainer } from '@react-navigation/native'
import { renderHook } from '@testing-library/react-native'
import { useOnboardingHeader } from './useOnboardingHeader'
import { useHeaderState } from '../../components/header/store'
import { Icon } from '../../components'
import { goToHomepage } from '../../utils/web'

const navigateMock = jest.fn()
jest.mock('../useNavigation', () => ({
  useNavigation: jest.fn(() => ({
    navigate: (...args: any[]) => navigateMock(...args),
  })),
}))

const wrapper = ({ children }: ComponentProps) => <NavigationContainer>{children}</NavigationContainer>

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
    expect(useHeaderState.getState().icons?.[0].iconComponent.type).toBe(Icon)
    expect(useHeaderState.getState().icons?.[0].iconComponent.props.id).toBe('mail')
    expect(useHeaderState.getState().icons?.[0].onPress).toBeInstanceOf(Function)
    expect(useHeaderState.getState().icons?.[1].iconComponent.type).toBe(Icon)
    expect(useHeaderState.getState().icons?.[1].iconComponent.props.id).toBe('globe')
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
