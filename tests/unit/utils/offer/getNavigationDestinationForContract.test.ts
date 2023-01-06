import { getContract } from '../../../../src/utils/contract'
import { getNavigationDestinationForContract } from '../../../../src/views/yourTrades/utils/'

jest.mock('../../../../src/utils/contract', () => ({
  getContract: jest.fn(),
}))

afterEach(() => {
  jest.clearAllMocks()
})
describe('getNavigationDestinationForContract', () => {
  it('should navigate to contract', () => {
    const contractSummary: Partial<ContractSummary> = {
      id: '3',
      tradeStatus: 'paymentRequired',
    }

    const [destination, params] = getNavigationDestinationForContract(contractSummary as ContractSummary)

    expect(destination).toBe('contract')
    expect(params).toEqual({ contractId: '3' })
  })

  it('should navigate to tradeComplete', () => {
    const contract = {
      id: '1-2',
    }
    const contractSummary: Partial<ContractSummary> = {
      id: '3',
      tradeStatus: 'tradeCompleted',
    }

    ;(<jest.Mock>getContract).mockReturnValue(contract)
    const [destination, params] = getNavigationDestinationForContract(contractSummary as ContractSummary)

    expect(destination).toBe('tradeComplete')
    expect(params).toEqual({ contract })
  })
})
