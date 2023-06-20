import { renderHook } from '@testing-library/react-native'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { queryClient, QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useNavigateToOffer } from './useNavigateToOffer'

const getOfferDetailsMock = jest.fn().mockResolvedValue([sellOffer])
jest.mock('../../../utils/peachAPI', () => ({
  getOfferDetails: () => getOfferDetailsMock(),
}))
const startRefundPopupMock = jest.fn()
jest.mock('../../../popups/useStartRefundPopup', () => ({
  useStartRefundPopup: () => startRefundPopupMock,
}))

const wrapper = ({ children }: ComponentProps) => (
  <NavigationWrapper>
    <QueryClientWrapper>{children}</QueryClientWrapper>
  </NavigationWrapper>
)

jest.mock('../../../queryClient', () => ({
  queryClient,
}))
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
  it('should not navigate to offer if it is not an offer summary', async () => {
    const { result } = renderHook(useNavigateToOffer, {
      initialProps: {
        price: 21,
        currency: 'EUR',
        amount: 0.0001,
        creationDate: new Date('2021-08-31'),
        id: '3-4',
        lastModified: new Date('2021-08-31'),
        offerId: '3',
        type: 'ask',
        tradeStatus: 'waiting',
        unreadMessages: 0,
      } satisfies ContractSummary,
      wrapper,
    })
    await result.current()
    expect(navigateMock).not.toHaveBeenCalled()
  })
  it('should open popup if status is refundTxSignatureRequired', async () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'refundTxSignatureRequired',
    }
    const { result } = renderHook(useNavigateToOffer, {
      initialProps: offerSummary as OfferSummary,
      wrapper,
    })
    await result.current()
    expect(startRefundPopupMock).toHaveBeenCalledWith(sellOffer)
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
