import { useDrawerState } from '../../components/drawer/useDrawerState'
import { HeaderConfig } from '../../components/header/Header'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useHeaderSetup } from '../useHeaderSetup'
import { useLanguage } from '../useLanguage'
import { useNavigation } from '../useNavigation'

export const useOnboardingHeader = (config: HeaderConfig) => {
  const navigation = useNavigation()
  const updateDrawer = useDrawerState((state) => state.updateDrawer)
  const { locale, updateLocale } = useLanguage()

  const openLanguageDrawer = () => {
    updateDrawer({
      title: i18n('language.select'),
      options: i18n.getLocales().map((l) => ({
        title: i18n(`languageName.${l}`),
        onPress: () => {
          updateLocale(l)
          updateDrawer({ show: false })
        },
        iconRightID: l === locale ? 'check' : undefined,
      })),
      show: true,
    })
  }
  const headerIcons: HeaderConfig['icons'] = [
    { id: 'mail', color: tw`text-primary-background-light`.color, onPress: () => navigation.navigate('contact') },
    { id: 'globe', color: tw`text-primary-background-light`.color, onPress: openLanguageDrawer },
  ]
  useHeaderSetup({
    theme: 'inverted',
    ...config,
    icons: config.icons || headerIcons,
  })
}
