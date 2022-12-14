import React from 'react'
import { Icon } from '../../components'
import tw from '../../styles/tailwind'
import { goToHomepage } from '../../utils/web'

export const headerIcons = [
  {
    iconComponent: <Icon id="mail" color={tw`text-primary-background-light`.color} />,
    onPress: () => null,
  },
  {
    iconComponent: <Icon id="globe" color={tw`text-primary-background-light`.color} />,
    onPress: goToHomepage,
  },
]
