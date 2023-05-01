import { useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { HelpIcon } from '../../../components/icons'

import { useHeaderSetup, useNavigation, useShowHelp } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { isBackupMandatory } from '../../../utils/account'
import { BuyTitleComponent } from '../components/BuyTitleComponent'
import { useSelfUser } from '../../../hooks/query/useSelfUser'

export const useBuySetup = () => {
  const navigation = useNavigation()
  const { user } = useSelfUser()
  const freeTrades = user?.freeTrades || 0
  const maxFreeTrades = 5
  const showHelp = useShowHelp('buyingBitcoin')
  const [lastFileBackupDate, lastSeedBackupDate] = useSettingsStore(
    (state) => [state.lastFileBackupDate, state.lastSeedBackupDate],
    shallow,
  )

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
    if (!lastSeedBackupDate && !lastFileBackupDate && isBackupMandatory()) {
      navigation.replace('backupTime', { view: 'buyer' })
    }
  }, [navigation, lastSeedBackupDate, lastFileBackupDate])

  return { freeTrades, maxFreeTrades }
}
