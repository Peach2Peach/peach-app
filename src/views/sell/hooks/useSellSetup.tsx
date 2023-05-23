import { useEffect, useMemo } from 'react'

import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { HelpType } from '../../../overlays/helpOverlays'
import { useSettingsStore } from '../../../store/settingsStore'
import { isBackupMandatory } from '../../../utils/account'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { SellTitleComponent } from '../components/SellTitleComponent'

export type UseSellSetupProps = {
  help: HelpType
  hideGoBackButton?: boolean
}
export const useSellSetup = ({ help, hideGoBackButton }: UseSellSetupProps) => {
  const navigation = useNavigation()
  const showHelp = useShowHelp(help)
  const lastFileBackupDate = useSettingsStore((state) => state.lastFileBackupDate)
  const lastSeedBackupDate = useSettingsStore((state) => state.lastSeedBackupDate)

  useHeaderSetup(
    useMemo(
      () => ({
        titleComponent: <SellTitleComponent />,
        hideGoBackButton,
        icons: [{ ...headerIcons.help, onPress: showHelp }],
      }),
      [hideGoBackButton, showHelp],
    ),
  )

  useEffect(() => {
    if (!lastSeedBackupDate && !lastFileBackupDate && isBackupMandatory()) {
      navigation.replace('backupTime', { view: 'seller' })
    }
  }, [navigation, lastSeedBackupDate, lastFileBackupDate])
}
