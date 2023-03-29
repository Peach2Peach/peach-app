import { contract } from '../../../../tests/unit/data/contractData'
import { contractStore } from '../../../store/contractStore'
import { contractStorage } from '../../../utils/account/contractStorage'
import { migrateContractsToStore } from './migrateContractsToStore'

const loadContractsMock = jest.fn()
jest.mock('../../../utils/account/loadAccount/loadContracts', () => ({
  loadContracts: () => loadContractsMock(),
}))

describe('migrateContractsToStore', () => {
  afterEach(() => {
    contractStore.getState().reset()
    jest.clearAllMocks()
  })
  it('migrates all contracts to contract store', async () => {
    loadContractsMock.mockResolvedValueOnce([contract])
    await migrateContractsToStore()

    expect(contractStore.getState().getContracts()).toEqual({
      [contract.id]: contract,
    })
    expect(contractStorage.clearStore).toHaveBeenCalled()
  })
  it('performs migration only once', async () => {
    loadContractsMock.mockResolvedValueOnce([contract])
    await migrateContractsToStore()
    await migrateContractsToStore()

    expect(loadContractsMock).toHaveBeenCalledTimes(1)
  })
})
