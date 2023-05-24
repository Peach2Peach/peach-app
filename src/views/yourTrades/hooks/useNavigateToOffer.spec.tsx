import { renderHook } from '@testing-library/react-native'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useNavigateToOffer } from './useNavigateToOffer'

const getOfferDetailsMock = jest.fn().mockResolvedValue([sellOffer])
jest.mock('../../../utils/peachAPI', () => ({
  getOfferDetails: () => getOfferDetailsMock(),
}))
const startRefundOverlayMock = jest.fn()
jest.mock('../../../overlays/useStartRefundOverlay', () => ({
  useStartRefundOverlay: () => startRefundOverlayMock,
}))

const wrapper = ({ children }: ComponentProps) => (
  <NavigationWrapper>
    <QueryClientWrapper>{children}</QueryClientWrapper>
  </NavigationWrapper>
)
describe('useNavigateToOffer', () => {
  it('should navigate to offer', async () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'offerCanceled',
    }
    const { result } = renderHook(useNavigateToOffer, {
      initialProps: offerSummary as OfferSummary,
      wrapper,
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
      wrapper,
    })
    await result.current()
    expect(startRefundOverlayMock).toHaveBeenCalledWith(sellOffer)
  })
  it('should navigate to wrongFundingAmount if status is fundingAmountDifferent', async () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'fundingAmountDifferent',
    }
    const { result } = renderHook(useNavigateToOffer, {
      initialProps: offerSummary as OfferSummary,
      wrapper,
    })
    await result.current()
    expect(navigateMock).toHaveBeenCalledWith('wrongFundingAmount', { offerId: offerSummary.id })
  })
})
