import { useAccountStore } from '../../../store/accountStore'
import { loadIdentity } from '../../../utils/account'

export const migrateAccountToStore = async () => {
  if (useAccountStore.getState().migrated) return
  const identity = await loadIdentity()
  useAccountStore.getState().setIdentity(identity)
  useAccountStore.getState().setMigrated()
}
