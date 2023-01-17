import React, { useMemo } from 'react'
import { HelpIcon } from '../../../components/icons'

import { useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { HelpType } from '../../../overlays/helpOverlays'
import SellTitleComponent from '../components/SellTitleComponent'

type UseSellSetupProps = {
  help: HelpType
  hideGoBackButton?: boolean
}
export const useSellSetup = ({ help, hideGoBackButton }: UseSellSetupProps) => {
  const showHelp = useShowHelp(help)

  useHeaderSetup(
    useMemo(
      () => ({
        titleComponent: <SellTitleComponent />,
        hideGoBackButton,
        icons: [{ iconComponent: <HelpIcon />, onPress: showHelp }],
      }),
      [hideGoBackButton, showHelp],
    ),
  )
}
