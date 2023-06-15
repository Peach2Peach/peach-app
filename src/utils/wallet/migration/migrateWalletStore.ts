import { WalletStore } from '../walletStore'
import { version0 } from './version0'

export const migrateWalletStore = (persistedState: unknown, version: number): WalletStore | Promise<WalletStore> => {
  let migratedState = persistedState as WalletStore
  if (version < 1) migratedState = version0(migratedState)

  return migratedState
}
