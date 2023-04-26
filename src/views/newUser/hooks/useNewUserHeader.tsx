import { useMemo } from 'react'
import { Icon } from '../../../components'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { goToHomepage } from '../../../utils/web'

type Props = { hideUserActions?: boolean }

export const useNewUserHeader = ({ hideUserActions }: Props) => {
  const navigation = useNavigation()
  const headerIcons = useMemo(
    () => [
      {
        iconComponent: <Icon id="mail" color={tw`text-primary-background-light`.color} />,
        onPress: () => navigation.navigate('contact'),
      },
      {
        iconComponent: <Icon id="globe" color={tw`text-primary-background-light`.color} />,
        onPress: goToHomepage,
      },
    ],
    [navigation],
  )
  const headerConfig = useMemo(
    () => ({
      title: i18n('welcome.welcomeToPeach.title'),
      hideGoBackButton: hideUserActions,
      icons: !hideUserActions ? headerIcons : undefined,
      theme: 'inverted' as const,
    }),
    [headerIcons, hideUserActions],
  )
  useHeaderSetup(headerConfig)
}
