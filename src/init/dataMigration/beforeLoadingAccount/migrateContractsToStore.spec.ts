import { contract } from '../../../../tests/unit/data/contractData'
import { useLocalContractStore } from '../../../store/useLocalContractStore'
import { storeContracts } from '../../../utils/account'
import { contractStorage } from '../../../utils/account/contractStorage'
import { migrateContractsToStore } from './migrateContractsToStore'

describe('migrateContractsToStore', () => {
  const contracts = [
    {
      ...contract,
      id: 'id',
    },
    {
      ...contract,
      error: 'DECRYPTION_ERROR',
      disputeResultAcknowledged: true,
      cancelConfirmationPending: true,
      cancelConfirmationDismissed: true,
      id: 'id2',
    },
  ]
  beforeEach(async () => {
    jest.clearAllMocks()
    useLocalContractStore.setState({
      migrated: false,
      contracts: {},
    })

    await storeContracts(contracts)
  })
  it('should migrate contracts to store', async () => {
    await migrateContractsToStore()

    expect(useLocalContractStore.getState().migrated).toBe(true)
    expect(useLocalContractStore.getState().contracts).toStrictEqual({
      id: {
        id: 'id',
        hasSeenDisputeEmailPopup: true,
        error: undefined,
        disputeResultAcknowledged: false,
        cancelConfirmationPending: false,
        cancelConfirmationDismissed: false,
      },
      id2: {
        id: 'id2',
        hasSeenDisputeEmailPopup: true,
        error: 'DECRYPTION_ERROR',
        disputeResultAcknowledged: true,
        cancelConfirmationPending: true,
        cancelConfirmationDismissed: true,
      },
    })

    expect(contractStorage.clearStore).toHaveBeenCalled()
  })
  it('should not migrate contracts to store if already migrated', async () => {
    useLocalContractStore.setState({
      migrated: true,
    })
    await migrateContractsToStore()
    expect(useLocalContractStore.getState().contracts).toStrictEqual({})
  })
})
