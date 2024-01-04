import { act, renderHook } from 'test-utils'
import { sellOffer } from '../../peach-api/src/testData/offers'
import { contractSummary } from '../../tests/unit/data/contractSummaryData'
import { navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { useNavigateToOfferOrContract } from './useNavigateToOfferOrContract'

const startRefundPopupMock = jest.fn()
jest.mock('../popups/useStartRefundPopup', () => ({
  useStartRefundPopup: () => startRefundPopupMock,
}))

describe('useNavigateToOfferOrContract - contracts', () => {
  it('should navigate to the contract', async () => {
    const { result } = renderHook(() => useNavigateToOfferOrContract(contractSummary))
    await act(async () => {
      await result.current()
    })

    expect(navigateMock).toHaveBeenCalledWith('contract', { contractId: contractSummary.id })
  })
})

describe('useNavigateToOfferOrContract - offers', () => {
  it('should navigate to offer', async () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'offerCanceled',
    }
    const { result } = renderHook(useNavigateToOfferOrContract, {
      initialProps: offerSummary as OfferSummary,
    })
    await result.current()
    expect(navigateMock).toHaveBeenCalledWith('offer', { offerId: offerSummary.id })
  })
  it('should open popup if status is refundTxSignatureRequired', async () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'refundTxSignatureRequired',
    }
    const { result } = renderHook(useNavigateToOfferOrContract, {
      initialProps: offerSummary as OfferSummary,
    })
    await result.current()
    expect(startRefundPopupMock).toHaveBeenCalledWith(sellOffer)
  })
  it('should navigate to wrongFundingAmount if status is fundingAmountDifferent', async () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'fundingAmountDifferent',
    }
    const { result } = renderHook(useNavigateToOfferOrContract, {
      initialProps: offerSummary as OfferSummary,
    })
    await result.current()
    expect(navigateMock).toHaveBeenCalledWith('wrongFundingAmount', { offerId: offerSummary.id })
  })
})
