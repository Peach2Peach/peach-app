import { useSetOverlay } from '../../../Overlay'
import { useSettingsStore } from '../../../store/settingsStore/useSettingsStore'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { BackupTime } from '../../overlays/BackupTime'

export const useWalletBalance = () => {
  const balance = useWalletState((state) => state.balance)

  const [shouldShowBackupOverlay, showBackupReminder, setShowBackupReminder] = useSettingsStore((state) => [
    state.shouldShowBackupOverlay,
    state.showBackupReminder,
    state.setShowBackupReminder,
  ])

  const setOverlay = useSetOverlay()
  if (!showBackupReminder && balance > 0 && shouldShowBackupOverlay) {
    setShowBackupReminder(true)
    setOverlay(<BackupTime navigationParams={[{ name: 'homeScreen', params: { screen: 'wallet' } }]} />)
  }

  return {
    balance,
  }
}
