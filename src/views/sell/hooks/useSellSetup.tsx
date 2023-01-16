import React, { useMemo } from 'react'
import { HelpIcon } from '../../../components/icons'

import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import SellTitleComponent from '../components/SellTitleComponent'

export const useSellSetup = () => {
  const showHelp = useShowHelp('buyingAndSelling')

  useHeaderSetup(
    useMemo(
      () => ({
        titleComponent: <SellTitleComponent />,
        hideGoBackButton: true,
        icons: [{ iconComponent: <HelpIcon />, onPress: showHelp }],
      }),
      [showHelp],
    ),
  )

  return {}
}
