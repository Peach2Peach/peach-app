import React from 'react'
import { Icon } from '../../components'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { goToHomepage } from '../../utils/web'

export const getHeaderIcons = () => {
  const navigation = useNavigation()
  return [
    {
      iconComponent: <Icon id="mail" color={tw`text-primary-background-light`.color} />,
      onPress: () => navigation.navigate('reportFullScreen'),
    },
    {
      iconComponent: <Icon id="globe" color={tw`text-primary-background-light`.color} />,
      onPress: goToHomepage,
    },
  ]
}
