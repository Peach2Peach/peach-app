import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../components/header/store'
import { useOnboardingHeader } from './useOnboardingHeader'
import { DrawerContext, getDrawer, setDrawer } from '../../contexts/drawer'
import { useReducer } from 'react'
import { LanguageSelect } from '../../drawers/LanguageSelect'

const Wrapper = ({ children }: ComponentProps) => {
  const [, updateDrawer] = useReducer(setDrawer, getDrawer())
  return (
    <NavigationWrapper>
      <DrawerContext.Provider
        value={[{ title: '', content: null, show: false, previousDrawer: {}, onClose: () => {} }, updateDrawer]}
      >
        {children}
      </DrawerContext.Provider>
    </NavigationWrapper>
  )
}

describe('useOnboardingHeader', () => {
  const title = 'a title'

  it('should set up the header correctly', () => {
    renderHook(useOnboardingHeader, {
      initialProps: {
        title,
      },
      wrapper: Wrapper,
    })

    expect(useHeaderState.getState().title).toBe(title)
    expect(useHeaderState.getState().hideGoBackButton).toBe(false)
    expect(useHeaderState.getState().icons?.[0].id).toBe('mail')
    expect(useHeaderState.getState().icons?.[0].color).toBe('#FFFCFA')
    expect(useHeaderState.getState().icons?.[0].onPress).toBeInstanceOf(Function)
    expect(useHeaderState.getState().icons?.[1].id).toBe('globe')
    expect(useHeaderState.getState().icons?.[1].color).toBe('#FFFCFA')
    expect(useHeaderState.getState().icons?.[1].onPress).toBeInstanceOf(Function)
    expect(useHeaderState.getState().theme).toBe('inverted')
  })
  it('allows overwriting values', () => {
    renderHook(useOnboardingHeader, {
      initialProps: {
        title,
        hideGoBackButton: true,
        icons: [],
      },
      wrapper: Wrapper,
    })

    expect(useHeaderState.getState().title).toBe(title)
    expect(useHeaderState.getState().hideGoBackButton).toBe(true)
    expect(useHeaderState.getState().icons).toHaveLength(0)
  })
  it('should navigate to contact', () => {
    renderHook(useOnboardingHeader, { initialProps: { title }, wrapper: Wrapper })

    useHeaderState.getState().icons?.[0].onPress()

    expect(navigateMock).toHaveBeenCalledWith('contact')
  })
  it('should open language select drawer', () => {
    renderHook(useOnboardingHeader, { initialProps: { title }, wrapper: Wrapper })

    useHeaderState.getState().icons?.[1].onPress()

    expect(getDrawer()).toEqual({
      content: <LanguageSelect locales={['en', 'es']} onSelect={expect.any(Function)} selected="en" />,
      onClose: expect.any(Function),
      previousDrawer: {},
      show: true,
      title: 'select language',
    })
  })
})
