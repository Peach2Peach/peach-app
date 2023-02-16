import React, { useEffect, useMemo } from 'react'
import { HelpIcon } from '../../../components/icons'

import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { isBackupMandatory } from '../../../utils/account'
import BuyTitleComponent from '../components/BuyTitleComponent'

export const useBuySetup = () => {
  const navigation = useNavigation()
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

  useEffect(() => {
    if (isBackupMandatory()) navigation.replace('backupTime', { view: 'buyer' })
  }, [navigation])
}
