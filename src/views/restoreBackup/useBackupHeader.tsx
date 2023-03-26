import { useMemo } from 'react'
import { Icon } from '../../components'
import { useHeaderSetup, useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { goToHomepage } from '../../utils/web'

export const useBackupHeader = () => {
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
      title: i18n('restoreBackup.title'),
      icons: headerIcons,
      theme: 'inverted' as const,
    }),
    [headerIcons],
  )
  useHeaderSetup(headerConfig)
}
