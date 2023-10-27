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
  it('should navigate to contract', () => {
    const contractSummary = {
      id: '3',
      tradeStatus: 'paymentRequired',
    } as const

    const [destination, params] = getNavigationDestinationForContract(contractSummary)

    expect(destination).toBe('contract')
    expect(params).toEqual({ contractId: '3' })
  })

  it('should navigate to tradeComplete (rate user screen)', () => {
    const contractSummary = {
      id: '3',
      tradeStatus: 'rateUser',
    } as const

    const [destination, params] = getNavigationDestinationForContract(contractSummary)

    expect(destination).toBe('tradeComplete')
    expect(params).toEqual({ contractId: contractSummary.id })
  })
})
