import { useMemo } from 'react'
import { Icon } from '../../../components'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { goToHomepage } from '../../../utils/web'

const iconColor = tw`text-primary-background-light`.color
export const useWelcomeHeader = () => {
  const navigation = useNavigation()
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('welcome.welcomeToPeach.title'),
        hideGoBackButton: true,
        icons: [
          {
            iconComponent: <Icon id="mail" color={iconColor} />,
            onPress: () => navigation.navigate('contact'),
          },
          {
            iconComponent: <Icon id="globe" color={iconColor} />,
            onPress: goToHomepage,
          },
        ],
        theme: 'inverted',
      }),
      [navigation],
    ),
  )
}
