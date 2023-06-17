import { useGoToOfferOrContract } from './useGoToOfferOrContract'
import { renderHook } from '@testing-library/react-native'
import { navigateMock, NavigationWrapper } from '../../tests/unit/helpers/NavigationWrapper'
import { contract } from '../../tests/unit/data/contractData'
import { sellOffer } from '../../tests/unit/data/offerData'

const getContractMock = jest.fn(() => Promise.resolve([contract, null]))
const getOfferDetailsMock = jest.fn(() => Promise.resolve([sellOffer, null]))
jest.mock('../utils/peachAPI', () => ({
  getContract: () => getContractMock(),
  getOfferDetails: () => getOfferDetailsMock(),
}))

describe('useGoToOfferOrContract', () => {
  it('should navigate to the contract if the id is a contract id', async () => {
    const { result } = renderHook(useGoToOfferOrContract, {
      wrapper: NavigationWrapper,
    })

    await result.current('PC-123-456')

    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
  })

  it('should navigate to the offer if the id is an offer id', async () => {
    const { result } = renderHook(useGoToOfferOrContract, {
      wrapper: NavigationWrapper,
    })

    await result.current('P-123')

    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('yourTrades', undefined)
  })
  it('should not navigate if the id is a contract id and the contract is not found', async () => {
    getContractMock.mockResolvedValueOnce([null, null])
    const { result } = renderHook(useGoToOfferOrContract, {
      wrapper: NavigationWrapper,
    })

    await result.current('PC-123-456')

    expect(navigateMock).toHaveBeenCalledTimes(0)
  })
  it('should not navigate if the id is an offer id and the offer is not found', async () => {
    getOfferDetailsMock.mockResolvedValueOnce([null, null])
    const { result } = renderHook(useGoToOfferOrContract, {
      wrapper: NavigationWrapper,
    })

    await result.current('P-123')

    expect(navigateMock).toHaveBeenCalledTimes(0)
  })
})
