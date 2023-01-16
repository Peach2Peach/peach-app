import React, { useMemo } from 'react'
import { HelpIcon } from '../../../components/icons'

import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import BuyTitleComponent from '../components/BuyTitleComponent'

export const useBuySetup = () => {
  const showHelp = useShowHelp('buyingAndSelling')

  useHeaderSetup(
    useMemo(
      () => ({
        titleComponent: <BuyTitleComponent />,
        hideGoBackButton: true,
        icons: [{ iconComponent: <HelpIcon />, onPress: showHelp }],
      }),
      [showHelp],
    ),
  )

  return {}
}
