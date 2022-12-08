import React from 'react'
import { CrazyHeaderIcon, HelpIcon, BellIcon } from '../../components/icons/components'

export const getHeaderIcons = (page: 'buy' | 'sell') => {
  let defaultIcons = [
    {
      iconComponent: <CrazyHeaderIcon />,
      onPress: () => null,
    },
    { iconComponent: <HelpIcon />, onPress: () => null },
  ]
  if (page === 'buy') defaultIcons = [{ iconComponent: <BellIcon />, onPress: () => null }, ...defaultIcons]
  return defaultIcons
}
