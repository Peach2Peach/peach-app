import { renderHook } from 'test-utils'
import { headerState, navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { useDrawerState } from '../../components/drawer/useDrawerState'
import { LanguageSelect } from '../../drawers/LanguageSelect'
import { useOnboardingHeader } from './useOnboardingHeader'

describe('useOnboardingHeader', () => {
  const title = 'a title'

  it('should set up the header correctly', () => {
    renderHook(useOnboardingHeader, { initialProps: { title } })

    expect(headerState.header()).toMatchSnapshot()
  })
  it('allows overwriting values', () => {
    renderHook(useOnboardingHeader, {
      initialProps: {
        title,
        hideGoBackButton: true,
        icons: [],
      },
    })

    expect(headerState.header()).toMatchSnapshot()
  })
  it('should navigate to contact', () => {
    renderHook(useOnboardingHeader, { initialProps: { title } })

    headerState.header().props.icons[0].onPress()

    expect(navigateMock).toHaveBeenCalledWith('contact')
  })
  it('should open language select drawer', () => {
    renderHook(useOnboardingHeader, { initialProps: { title } })

    headerState.header().props.icons[1].onPress()

    const drawerContent = useDrawerState.getState().content || <></>

    expect(drawerContent).toEqual(
      <LanguageSelect
        locales={['en', 'es', 'fr', 'it', 'de', 'nl', 'el-GR', 'tr', 'sw', 'hu', 'raw', 'pl', 'pt', 'pt-BR', 'ru', 'uk']}
        onSelect={expect.any(Function)}
        selected="en"
      />,
    )
  })
})
