import { useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { useHeaderSetup, useNavigation, useShowHelp } from '../../../hooks'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useSettingsStore } from '../../../store/settingsStore'
import { isBackupMandatory } from '../../../utils/account'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { BuyTitleComponent } from '../components/BuyTitleComponent'

export const useBuySetup = () => {
  const navigation = useNavigation()
  const { user } = useSelfUser()
  const freeTrades = user?.freeTrades || 0
  const maxFreeTrades = user?.maxFreeTrades || 0
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
        icons: [{ ...headerIcons.help, onPress: showHelp }],
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
