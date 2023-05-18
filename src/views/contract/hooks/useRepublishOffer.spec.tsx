import { useRepublishOffer } from './useRepublishOffer'
import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { OfferRepublished } from '../../../overlays/tradeCancelation'
import { defaultOverlay, OverlayContext } from '../../../contexts/overlay'

const reviveSellOfferMock = jest.fn()
jest.mock('../../../utils/peachAPI', () => ({
  reviveSellOffer: (params: { offerId: string }) => reviveSellOfferMock(params),
}))

const getSellOfferFromContractMock = jest.fn()
const saveContractMock = jest.fn()
jest.mock('../../../utils/contract', () => ({
  getSellOfferFromContract: (contract: Contract) => getSellOfferFromContractMock(contract),
  saveContract: (contract: Contract) => saveContractMock(contract),
}))

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

let overlay = defaultOverlay
const updateOverlayMock = jest.fn((newOverlay) => {
  overlay = newOverlay
})
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationWrapper>
    <OverlayContext.Provider value={[overlay, updateOverlayMock]}>{children}</OverlayContext.Provider>
  </NavigationWrapper>
)
describe('useRepublishOffer', () => {
  const contract = {
    id: 'contractId',
    cancelConfirmationDismissed: false,
    cancelConfirmationPending: true,
  } as unknown as Contract
  const sellOffer = {
    id: 'offerId',
  }

  afterEach(() => {
    jest.clearAllMocks()
    overlay = defaultOverlay
  })
  it('should revive the sell offer', async () => {
    reviveSellOfferMock.mockResolvedValue([{ newOfferId: 'newOfferId' }, null])
    getSellOfferFromContractMock.mockReturnValue(sellOffer)
    const { result } = renderHook(useRepublishOffer, { wrapper })
    await result.current(contract)
    expect(reviveSellOfferMock).toHaveBeenCalledWith({ offerId: sellOffer.id })
  })

  it('should show an error banner and close the overlay if the sell offer could not be revived', async () => {
    reviveSellOfferMock.mockResolvedValue([null, { error: 'error' }])
    getSellOfferFromContractMock.mockReturnValue(sellOffer)
    const { result } = renderHook(useRepublishOffer, { wrapper })
    await result.current(contract)
    expect(showErrorBannerMock).toHaveBeenCalledWith('error')
    expect(overlay.visible).toBe(false)
  })

  it('should show the offer republished overlay', async () => {
    const { result } = renderHook(useRepublishOffer, { wrapper })
    reviveSellOfferMock.mockResolvedValue([{ newOfferId: 'newOfferId' }, null])
    getSellOfferFromContractMock.mockReturnValue(sellOffer)
    await result.current(contract)
    expect(overlay).toStrictEqual({
      title: 'offer re-published',
      content: <OfferRepublished />,
      visible: true,
      level: 'APP',
      requireUserAction: true,
      action1: {
        label: 'go to offer',
        icon: 'arrowRightCircle',
        callback: expect.any(Function),
      },
      action2: {
        label: 'close',
        icon: 'xSquare',
        callback: expect.any(Function),
      },
    })
  })

  it('should close the overlay, save the contract and navigate to contract when the close is pressed', async () => {
    const { result } = renderHook(useRepublishOffer, { wrapper })
    reviveSellOfferMock.mockResolvedValue([{ newOfferId: 'newOfferId' }, null])
    getSellOfferFromContractMock.mockReturnValue(sellOffer)
    await result.current(contract)
    overlay.action2?.callback()
    expect(overlay.visible).toBe(false)
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      cancelConfirmationPending: false,
      cancelConfirmationDismissed: true,
    })
    expect(replaceMock).toHaveBeenCalledWith('contract', { contractId: contract.id })
  })

  it('should close the overlay, save the contract and navigate to search when the go to offer is pressed', async () => {
    const { result } = renderHook(useRepublishOffer, { wrapper })
    reviveSellOfferMock.mockResolvedValue([{ newOfferId: 'newOfferId' }, null])
    getSellOfferFromContractMock.mockReturnValue(sellOffer)
    await result.current(contract)
    overlay.action1?.callback()
    expect(overlay.visible).toBe(false)
    expect(saveContractMock).toHaveBeenCalledWith({
      ...contract,
      cancelConfirmationPending: false,
      cancelConfirmationDismissed: true,
    })
    expect(replaceMock).toHaveBeenCalledWith('search', { offerId: 'newOfferId' })
  })
})
