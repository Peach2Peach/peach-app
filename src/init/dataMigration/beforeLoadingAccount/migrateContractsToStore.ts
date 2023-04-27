import { useLocalContractStore } from '../../../store/useLocalContractStore'
import { loadContracts } from '../../../utils/account'
import { contractStorage } from '../../../utils/account/contractStorage'

export const migrateContractsToStore = async () => {
  if (useLocalContractStore.getState().migrated) return
  const contracts = await loadContracts()
  useLocalContractStore.getState().migrateContracts(contracts)
  useLocalContractStore.setState({
    migrated: true,
  })
  contractStorage.clearStore()
}
