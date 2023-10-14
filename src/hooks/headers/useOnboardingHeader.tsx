import { useDrawerState } from '../../components/drawer/useDrawerState'
import { HeaderConfig } from '../../components/header/Header'
import { LanguageSelect } from '../../drawers/LanguageSelect'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useHeaderSetup } from '../useHeaderSetup'
import { useLanguage } from '../useLanguage'
import { useNavigation } from '../useNavigation'

export const useOnboardingHeader = (config: HeaderConfig) => {
  const navigation = useNavigation()
  const updateDrawer = useDrawerState((state) => state.updateDrawer)
  const { locale, setLocale, saveLocale } = useLanguage()

  const openLanguageDrawer = () => {
    updateDrawer({
      title: i18n('language.select'),
      content: (
        <LanguageSelect
          locales={i18n.getLocales()}
          selected={locale}
          onSelect={(lcl: string) => {
            setLocale(lcl)
            saveLocale(lcl)
            updateDrawer({ show: false })
          }}
        />
      ),
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
