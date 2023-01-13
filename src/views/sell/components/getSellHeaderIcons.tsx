import React from 'react'
import { StatsIcon, HelpIcon } from '../../../components/icons'

export const getSellHeaderIcons = () => [
  {
    iconComponent: <StatsIcon />,
    onPress: () => null,
  },
  { iconComponent: <HelpIcon />, onPress: () => null },
]
