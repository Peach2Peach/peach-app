import React from 'react'
import { StatsIcon, HelpIcon, BellIcon } from '../../../components/icons'

export const getBuyHeaderIcons = () => [
  { iconComponent: <BellIcon />, onPress: () => null },
  {
    iconComponent: <StatsIcon />,
    onPress: () => null,
  },
  { iconComponent: <HelpIcon />, onPress: () => null },
]
