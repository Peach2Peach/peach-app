import React, { useEffect, useMemo } from 'react'
import { HelpIcon } from '../../../components/icons'

import { useHeaderSetup, useNavigation, useShowHelp } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { isBackupMandatory } from '../../../utils/account'
import { BuyTitleComponent } from '../components/BuyTitleComponent'

export const useBuySetup = () => {
  const navigation = useNavigation()
  const showHelp = useShowHelp('buyingBitcoin')
  const lastBackupDate = useSettingsStore((state) => state.lastBackupDate)

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

  useEffect(() => {
    if (!lastBackupDate && isBackupMandatory()) navigation.replace('backupTime', { view: 'buyer' })
  }, [navigation, lastBackupDate])
}
