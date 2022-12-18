import { StackNavigation } from '../../../../src/utils/navigation'
import { navigateToOffer } from '../../../../src/views/yourTrades/utils/navigateToOffer'
import { buyOffer } from '../../data/offerData'

const mockOfferStatus: TradeStatus = {
  requiredAction: 'confirmPayment',
  status: 'escrowWaitingForConfirmation',
}
const mockContract = {
  canceled: false,
  disputeWinner: 'disputeWinner',
  id: 'id',
}
const mockOffer = {
  ...buyOffer,
  contractId: '123',
}

const navigate = jest.fn()
const navigation = {
  navigate,
} as unknown as StackNavigation

const updateOverlay = jest.fn()

const getContract = jest.fn()
jest.mock('../../../../src/utils/contract/getContract', () => ({
  getContract: (id: string) => getContract(id),
}))
const shouldUpdateOverlay = jest.fn()
jest.mock('../../../../src/views/yourTrades/utils/shouldUpdateOverlay', () => ({
  shouldUpdateOverlay: () => shouldUpdateOverlay(),
}))
const getNavigationDestination = jest.fn((offer, offerStatus, contract) => ['offer', { offer: mockOffer }])
jest.mock('../../../../src/views/yourTrades/utils/getNavigationDestination', () => ({
  getNavigationDestination: (offer: BuyOffer | SellOffer, offerStatus: TradeStatus, contract: Contract | null) =>
    getNavigationDestination(offer, offerStatus, contract),
}))

describe('navigateToOffer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should get the contract if the offer has a contract id', () => {
    navigateToOffer(mockOffer, mockOfferStatus, navigation, updateOverlay)

    expect(getContract).toHaveBeenCalledWith(mockOffer.contractId)
  })

  it('should not get the contract if the offer does not have a contract id', () => {
    const offerWithoutContractId = { ...mockOffer, contractId: undefined }
    navigateToOffer(offerWithoutContractId, mockOfferStatus, navigation, updateOverlay)

    expect(getContract).not.toHaveBeenCalled()
  })

  it('should get the navigation destination', () => {
    getContract.mockReturnValueOnce(mockContract)
    navigateToOffer(mockOffer, mockOfferStatus, navigation, updateOverlay)

    expect(getNavigationDestination).toHaveBeenCalledWith(mockOffer, mockOfferStatus, mockContract)
  })

  it('should update the overlay if needed', () => {
    shouldUpdateOverlay.mockReturnValueOnce(true)
    navigateToOffer(mockOffer, mockOfferStatus, navigation, updateOverlay)

    expect(updateOverlay).toHaveBeenCalledTimes(1)
  })

  it('should not update the overlay if not needed', () => {
    shouldUpdateOverlay.mockReturnValueOnce(false)
    navigateToOffer(mockOffer, mockOfferStatus, navigation, updateOverlay)

    expect(updateOverlay).not.toHaveBeenCalled()
  })

  it('should navigate to the navigation destination', () => {
    getNavigationDestination.mockReturnValueOnce(['offer', { offer: mockOffer }])
    navigateToOffer(mockOffer, mockOfferStatus, navigation, updateOverlay)

    expect(navigation.navigate).toHaveBeenCalledWith('offer', { offer: mockOffer })

    getNavigationDestination.mockReturnValueOnce(['search', { offer: mockOffer }])
    navigateToOffer(mockOffer, mockOfferStatus, navigation, updateOverlay)

    expect(navigation.navigate).toHaveBeenCalledWith('search', { offer: mockOffer })
  })
})
