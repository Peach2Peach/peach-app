import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, headerState, navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { DrawerContext, defaultState } from '../../contexts/drawer'
import { LanguageSelect } from '../../drawers/LanguageSelect'
import { useOnboardingHeader } from './useOnboardingHeader'

let drawer = defaultState
const setDrawer = (newState: Partial<DrawerState>) => {
  drawer = { ...drawer, ...newState }
  return drawer
}
const Wrapper = ({ children }: ComponentProps) => (
  <NavigationWrapper>
    <DrawerContext.Provider value={[defaultState, setDrawer]}>{children}</DrawerContext.Provider>
  </NavigationWrapper>
)

describe('useOnboardingHeader', () => {
  const title = 'a title'

  it('should set up the header correctly', () => {
    renderHook(useOnboardingHeader, {
      initialProps: {
        title,
      },
      wrapper: Wrapper,
    })

    expect(headerState.header()).toMatchSnapshot()
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

    expect(headerState.header()).toMatchSnapshot()
  })
  it('should navigate to contact', () => {
    renderHook(useOnboardingHeader, { initialProps: { title }, wrapper: Wrapper })

    headerState.header().props.icons[0].onPress()

    expect(navigateMock).toHaveBeenCalledWith('contact')
  })
  it('should open language select drawer', () => {
    renderHook(useOnboardingHeader, { initialProps: { title }, wrapper: Wrapper })

    headerState.header().props.icons[1].onPress()

    expect(drawer).toEqual({
      content: (
        <LanguageSelect
          locales={['en', 'es', 'fr', 'it', 'de', 'el-GR', 'tr', 'sw', 'raw']}
          onSelect={expect.any(Function)}
          selected="en"
        />
      ),
      options: [],
      onClose: expect.any(Function),
      previousDrawer: undefined,
      show: true,
      title: 'select language',
    })
  })
})
