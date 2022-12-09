import React from 'react'
import { StatsIcon, HelpIcon, BellIcon } from '../../components/icons/components'

export const getHeaderIcons = (page: 'buy' | 'sell') => {
  let defaultIcons = [
    {
      iconComponent: <StatsIcon />,
      onPress: () => null,
    },
    { iconComponent: <HelpIcon />, onPress: () => null },
  ]
  if (page === 'buy') defaultIcons = [{ iconComponent: <BellIcon />, onPress: () => null }, ...defaultIcons]
  return defaultIcons
}
