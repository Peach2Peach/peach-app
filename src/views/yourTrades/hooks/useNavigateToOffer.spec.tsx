import { renderHook } from '@testing-library/react-native'
import { useNavigateToOffer } from './useNavigateToOffer'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { sellOffer } from '../../../../tests/unit/data/offerData'

const navigateMock = jest.fn()
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: (...args: any[]) => navigateMock(...args),
  }),
}))

const getOfferDetailsMock = jest.fn().mockResolvedValue([sellOffer])
jest.mock('../../../utils/peachAPI', () => ({
  getOfferDetails: () => getOfferDetailsMock(),
}))
const startRefundOverlayMock = jest.fn()
jest.mock('../../../overlays/useStartRefundOverlay', () => ({
  useStartRefundOverlay: () => startRefundOverlayMock,
}))
const confirmEscrowOverlayMock = jest.fn()
jest.mock('../../../overlays/useConfirmEscrowOverlay', () => ({
  useConfirmEscrowOverlay: () => confirmEscrowOverlayMock,
}))

describe('useNavigateToOffer', () => {
  it('should navigate to offer', async () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'offerCanceled',
    }
    const { result } = renderHook(useNavigateToOffer, {
      initialProps: offerSummary as OfferSummary,
      wrapper: QueryClientWrapper,
    })
    await result.current()
    expect(navigateMock).toHaveBeenCalledWith('offer', { offerId: offerSummary.id })
  })
  it('should open overlay if status is refundTxSignatureRequired', async () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'refundTxSignatureRequired',
    }
    const { result } = renderHook(useNavigateToOffer, {
      initialProps: offerSummary as OfferSummary,
      wrapper: QueryClientWrapper,
    })
    await result.current()
    expect(startRefundOverlayMock).toHaveBeenCalledWith(sellOffer)
  })
  it('should open overlay if status is fundingAmountDifferent', async () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'fundingAmountDifferent',
    }
    const { result } = renderHook(useNavigateToOffer, {
      initialProps: offerSummary as OfferSummary,
      wrapper: QueryClientWrapper,
    })
    await result.current()
    expect(confirmEscrowOverlayMock).toHaveBeenCalledWith(sellOffer)
  })
})
