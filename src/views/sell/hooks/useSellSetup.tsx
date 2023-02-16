import React, { useEffect, useMemo } from 'react'
import { HelpIcon } from '../../../components/icons'

import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { HelpType } from '../../../overlays/helpOverlays'
import { isBackupMandatory } from '../../../utils/account'
import SellTitleComponent from '../components/SellTitleComponent'

type UseSellSetupProps = {
  help: HelpType
  hideGoBackButton?: boolean
}
export const useSellSetup = ({ help, hideGoBackButton }: UseSellSetupProps) => {
  const navigation = useNavigation()
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

  useEffect(() => {
    if (isBackupMandatory()) navigation.replace('backupTime', { view: 'seller' })
  }, [navigation])
}
