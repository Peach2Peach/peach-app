import { Icon } from '../../components'
import { HeaderConfig } from '../../components/header/store'
import { useDrawerContext } from '../../contexts/drawer'
import { LanguageSelect } from '../../drawers/LanguageSelect'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useHeaderSetup } from '../useHeaderSetup'
import { useLanguage } from '../useLanguage'
import { useNavigation } from '../useNavigation'

export const useOnboardingHeader = (config: HeaderConfig) => {
  const navigation = useNavigation()
  const [, updateDrawer] = useDrawerContext()
  const { locale, setLocale, saveLocale } = useLanguage()

  const closeDrawer = () => updateDrawer({ show: false })
  const headerIcons = [
    {
      iconComponent: <Icon id="mail" color={tw`text-primary-background-light`.color} />,
      onPress: () => navigation.navigate('contact'),
    },
    {
      iconComponent: <Icon id="globe" color={tw`text-primary-background-light`.color} />,
      onPress: () => {
        updateDrawer({
          title: i18n('language.select'),
          content: (
            <LanguageSelect
              locales={i18n.getLocales()}
              selected={locale}
              onSelect={(lcl: string) => {
                setLocale(lcl)
                saveLocale(lcl)
                closeDrawer()
              }}
            />
          ),
          show: true,
        })
      },
    },
  ]
  useHeaderSetup({
    theme: 'inverted',
    ...config,
    icons: config.icons || headerIcons,
  })
}
