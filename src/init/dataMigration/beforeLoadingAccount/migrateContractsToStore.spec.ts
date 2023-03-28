import { account1 } from '../../../../tests/unit/data/accountData'
import { contractStore } from '../../../store/contractStore'
import { contractStorage } from '../../../utils/account/contractStorage'
import { migrateContractsToStore } from './migrateContractsToStore'

const loadContractsMock = jest.fn().mockResolvedValue(account1.contracts)
jest.mock('../../../utils/account/loadAccount/loadContracts', () => ({
  loadContracts: () => loadContractsMock(),
}))

describe('migrateContractsToStore', () => {
  afterEach(() => {
    contractStore.getState().reset()
    jest.clearAllMocks()
  })
  it('migrates all contracts to contract store', async () => {
    await migrateContractsToStore()

    expect(contractStore.getState().getContracts()).toEqual(account1.contracts)
    expect(contractStorage.clearStore).toHaveBeenCalled()
  })
  it('performs migration only once', async () => {
    loadContractsMock.mockResolvedValueOnce(account1.contracts)
    await migrateContractsToStore()
    await migrateContractsToStore()

    expect(loadContractsMock).toHaveBeenCalledTimes(1)
  })
})
