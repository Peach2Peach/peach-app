import { HeaderConfig } from '../../components/header/store'
import tw from '../../styles/tailwind'
import { goToHomepage } from '../../utils/web'
import { useHeaderSetup } from '../useHeaderSetup'
import { useNavigation } from '../useNavigation'

export const useOnboardingHeader = (config: HeaderConfig) => {
  const navigation = useNavigation()

  const headerIcons: HeaderConfig['icons'] = [
    { id: 'mail', color: tw`text-primary-background-light`.color, onPress: () => navigation.navigate('contact') },
    { id: 'globe', color: tw`text-primary-background-light`.color, onPress: goToHomepage },
  ]
  useHeaderSetup({
    theme: 'inverted',
    ...config,
    icons: config.icons || headerIcons,
  })
}
