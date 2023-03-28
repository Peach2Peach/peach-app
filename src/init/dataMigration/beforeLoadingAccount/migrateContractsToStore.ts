import { contractStore } from '../../../store/contractStore'
import { loadContracts } from '../../../utils/account'
import { contractStorage } from '../../../utils/account/contractStorage'

export const migrateContractsToStore = async () => {
  if (contractStore.getState().migrated) return
  const contracts = await loadContracts()
  contractStore.setState({
    contracts,
    migrated: true,
  })
  contractStorage.clearStore()
}
