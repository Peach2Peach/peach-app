import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { getNavigationDestinationForContract } from './getNavigationDestinationForContract'

jest.mock('../contract', () => ({
  getOfferIdFromContract: () => '1',
  getSellOfferIdFromContract: () => '1',
}))

const getContractMock = jest.fn()
jest.mock('../peachAPI', () => ({
  getContract: () => getContractMock(),
}))

jest.mock('../../queryClient', () => ({
  queryClient,
}))

describe('getNavigationDestinationForContract', () => {
  it('should navigate to contract', async () => {
    const contractSummary: Partial<ContractSummary> = {
      id: '3',
      tradeStatus: 'paymentRequired',
    }

    const [destination, params] = await getNavigationDestinationForContract(contractSummary as ContractSummary)

    expect(destination).toBe('contract')
    expect(params).toEqual({ contractId: '3' })
  })

  it('should navigate to tradeComplete (rate user screen)', async () => {
    const contract = {
      id: '1-2',
    }
    const contractSummary: Partial<ContractSummary> = {
      id: '3',
      tradeStatus: 'rateUser',
    }

    getContractMock.mockReturnValue([contract])
    const [destination, params] = await getNavigationDestinationForContract(contractSummary as ContractSummary)

    expect(destination).toBe('tradeComplete')
    expect(params).toEqual({ contract })
  })

  it('should update the query cache', async () => {
    const contractSummary: Partial<ContractSummary> = {
      id: '1-2',
      tradeStatus: 'rateUser',
    }

    getContractMock.mockReturnValue([{ id: '1-2' }])
    await getNavigationDestinationForContract(contractSummary as ContractSummary)

    expect(queryClient.getQueryData(['contract', '1-2'])).toEqual({
      id: '1-2',
    })
  })
})
