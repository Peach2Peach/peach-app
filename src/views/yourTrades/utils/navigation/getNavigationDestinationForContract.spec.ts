// eslint-disable-next-line max-len
import { getNavigationDestinationForContract } from './getNavigationDestinationForContract'

jest.mock('../../../../utils/contract', () => ({
  getOfferIdFromContract: () => '1',
  getSellOfferIdFromContract: () => '1',
}))

const getContractMock = jest.fn()
jest.mock('../../../../utils/peachAPI', () => ({
  getContract: () => getContractMock(),
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

  it('should navigate to setRefundWallet', async () => {
    const contractSummary: Partial<ContractSummary> = {
      id: '3',
      tradeStatus: 'refundAddressRequired',
    }

    const [destination, params] = await getNavigationDestinationForContract(contractSummary as ContractSummary)

    expect(destination).toBe('setRefundWallet')
    expect(params).toEqual({ offerId: '1' })
  })
})
