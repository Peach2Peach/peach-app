import { contractStore } from '../../../store/contractStore'
import { loadContracts } from '../../../utils/account'
import { contractStorage } from '../../../utils/account/contractStorage'

export const migrateContractsToStore = async () => {
  if (contractStore.getState().migrated) return
  const contracts = await loadContracts()
  contracts.forEach(contractStore.getState().setContract)
  contractStore.setState({
    migrated: true,
  })
  contractStorage.clearStore()
}
