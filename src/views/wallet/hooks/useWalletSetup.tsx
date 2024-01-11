import { useCallback, useEffect, useState } from 'react'
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

  const { refresh, isRefreshing } = useSyncWallet()
  const [walletSynced, setWalletSynced] = useSessionStore(
    (state) => [state.walletSynced, state.setWalletSynced],
    shallow,
  )
  const [walletLoading, setWalletLoading] = useState(false)
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
    setWalletLoading(peachWallet.transactions.length === 0)

    await refresh()
    setWalletLoading(false)
    setWalletSynced(true)
    // adding refresh or peachWallet.transactions.length as dependencies causes an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peachWallet.initialized])

  useEffect(() => {
    if (syncOnLoad && !walletSynced) syncWalletOnLoad()
  }, [syncOnLoad, syncWalletOnLoad, walletSynced])

  return {
    balance,
    isRefreshing,
    walletLoading,
    refresh,
  }
}
