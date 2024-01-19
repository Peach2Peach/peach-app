import { useCallback, useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { useSetOverlay } from '../../../Overlay'
import { useSessionStore } from '../../../store/sessionStore'
import { useSettingsStore } from '../../../store/settingsStore/useSettingsStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { BackupTime } from '../../overlays/BackupTime'
import { useSyncWallet } from './useSyncWallet'

type Props = {
  peachWallet: PeachWallet
  syncOnLoad: boolean
}
export const useWalletSetup = ({ peachWallet, syncOnLoad }: Props) => {
  const balance = useWalletState((state) => state.balance)

  const { refetch, isRefetching, isLoading } = useSyncWallet()
  const [walletSynced, setWalletSynced] = useSessionStore(
    (state) => [state.walletSynced, state.setWalletSynced],
    shallow,
  )
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

  const syncWalletOnLoad = useCallback(async () => {
    if (!peachWallet.initialized) return
    await refetch()
    setWalletSynced(true)
  }, [peachWallet.initialized, refetch, setWalletSynced])

  useEffect(() => {
    if (syncOnLoad && !walletSynced) syncWalletOnLoad()
  }, [syncOnLoad, syncWalletOnLoad, walletSynced])

  return {
    balance,
    isRefreshing: isRefetching || isLoading,
    walletLoading: isLoading,
    refresh: refetch,
  }
}
