import { StackNavigation } from '../../../../src/utils/navigation'
import { navigateToOffer } from '../../../../src/views/yourTrades/utils'
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
const matchStoreSetOfferMock = jest.fn()

const getContract = jest.fn()
jest.mock('../../../../src/utils/contract/getContract', () => ({
  getContract: (id: string) => getContract(id),
}))
const shouldOpenRefundOverlay = jest.fn()
jest.mock('../../../../src/views/yourTrades/utils/shouldOpenRefundOverlay', () => ({
  shouldOpenRefundOverlay: () => shouldOpenRefundOverlay(),
}))
const getNavigationDestination = jest.fn((offer, offerStatus, contract) => ['offer', { offer: mockOffer }])
jest.mock('../../../../src/views/yourTrades/utils/getNavigationDestination', () => ({
  getNavigationDestination: (offer: BuyOffer | SellOffer, offerStatus: TradeStatus, contract: Contract | null) =>
    getNavigationDestination(offer, offerStatus, contract),
}))

// eslint-disable-next-line max-lines-per-function
describe('navigateToOffer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should get the contract if the offer has a contract id', () => {
    const navigateToOfferProps = {
      offer: mockOffer,
      requiredAction: mockOfferStatus.requiredAction,
      status: mockOfferStatus.status,
      navigation,
      updateOverlay,
      matchStoreSetOffer: matchStoreSetOfferMock,
    }
    navigateToOffer(navigateToOfferProps)

    expect(getContract).toHaveBeenCalledWith(mockOffer.contractId)
  })

  it('should not get the contract if the offer does not have a contract id', () => {
    const offerWithoutContractId = { ...mockOffer, contractId: undefined }
    const navigateToOfferProps = {
      offer: offerWithoutContractId,
      requiredAction: mockOfferStatus.requiredAction,
      status: mockOfferStatus.status,
      navigation,
      updateOverlay,
      matchStoreSetOffer: matchStoreSetOfferMock,
    }
    navigateToOffer(navigateToOfferProps)

    expect(getContract).not.toHaveBeenCalled()
  })

  it('should get the navigation destination', () => {
    getContract.mockReturnValueOnce(mockContract)
    const navigateToOfferProps = {
      offer: mockOffer,
      requiredAction: mockOfferStatus.requiredAction,
      status: mockOfferStatus.status,
      navigation,
      updateOverlay,
      matchStoreSetOffer: matchStoreSetOfferMock,
    }
    navigateToOffer(navigateToOfferProps)

    expect(getNavigationDestination).toHaveBeenCalledWith(mockOffer, mockOfferStatus, mockContract)
  })

  it('should update the overlay if needed', () => {
    shouldOpenRefundOverlay.mockReturnValueOnce(true)
    const navigateToOfferProps = {
      offer: mockOffer,
      requiredAction: mockOfferStatus.requiredAction,
      status: mockOfferStatus.status,
      navigation,
      updateOverlay,
      matchStoreSetOffer: matchStoreSetOfferMock,
    }
    navigateToOffer(navigateToOfferProps)

    expect(updateOverlay).toHaveBeenCalledTimes(1)
  })

  it('should not update the overlay if not needed', () => {
    shouldOpenRefundOverlay.mockReturnValueOnce(false)
    const navigateToOfferProps = {
      offer: mockOffer,
      requiredAction: mockOfferStatus.requiredAction,
      status: mockOfferStatus.status,
      navigation,
      updateOverlay,
      matchStoreSetOffer: matchStoreSetOfferMock,
    }
    navigateToOffer(navigateToOfferProps)

    expect(updateOverlay).not.toHaveBeenCalled()
  })

  it('should set the offer in the match store', () => {
    getNavigationDestination.mockReturnValueOnce(['search'])
    const navigateToOfferProps = {
      offer: mockOffer,
      navigation,
      updateOverlay,
      matchStoreSetOffer: matchStoreSetOfferMock,
      requiredAction: 'acknowledgeDisputeResult' as const,
      status: 'escrowWaitingForConfirmation' as const,
    }
    navigateToOffer(navigateToOfferProps)
    expect(matchStoreSetOfferMock).toHaveBeenCalledWith(mockOffer)
  })

  it('should navigate to the navigation destination', () => {
    getNavigationDestination.mockReturnValueOnce(['offer', { offer: mockOffer }])
    const navigateToOfferProps = {
      offer: mockOffer,
      requiredAction: mockOfferStatus.requiredAction,
      status: mockOfferStatus.status,
      navigation,
      updateOverlay,
      matchStoreSetOffer: matchStoreSetOfferMock,
    }
    navigateToOffer(navigateToOfferProps)

    expect(navigation.navigate).toHaveBeenCalledWith('offer', { offer: mockOffer })

    getNavigationDestination.mockReturnValueOnce(['search', { offer: mockOffer }])
    navigateToOffer(navigateToOfferProps)

    expect(navigation.navigate).toHaveBeenCalledWith('search', { offer: mockOffer })
  })
})
