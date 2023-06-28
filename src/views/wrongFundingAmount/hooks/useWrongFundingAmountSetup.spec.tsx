import { renderHook, waitFor } from '@testing-library/react-native'
import { sellOffer, wronglyFundedSellOffer } from '../../../../tests/unit/data/offerData'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { headerState } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useWrongFundingAmountSetup } from './useWrongFundingAmountSetup'

const wrapper = NavigationAndQueryClientWrapper

const useRouteMock = jest.fn(() => ({
  params: { offerId: sellOffer.id },
}))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner:
    () =>
      (...args: any[]) =>
        showErrorBannerMock(...args),
}))
const useOfferDetailsMock = jest.fn().mockReturnValue({ offer: wronglyFundedSellOffer })
jest.mock('../../../hooks/query/useOfferDetails', () => ({
  useOfferDetails: () => useOfferDetailsMock(),
}))

const apiSuccess = { success: true }
const confirmEscrowMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  confirmEscrow: (...args: any[]) => confirmEscrowMock(...args),
}))

jest.useFakeTimers()

describe('useWrongFundingAmountSetup', () => {
  it('returns defaults', () => {
    useOfferDetailsMock.mockReturnValueOnce({ offer: undefined })
    const { result } = renderHook(useWrongFundingAmountSetup, { wrapper })
    expect(result.current).toEqual({
      actualAmount: 0,
      confirmEscrow: expect.any(Function),
      fundingAmount: 0,
      sellOffer: undefined,
    })
  })
  it('returns funding information when sell offer is known', async () => {
    const { result } = renderHook(useWrongFundingAmountSetup, { wrapper })
    await waitFor(() => expect(result.current.sellOffer).toBeDefined())
    expect(result.current).toEqual({
      actualAmount: wronglyFundedSellOffer.funding.amounts[0],
      confirmEscrow: expect.any(Function),
      fundingAmount: wronglyFundedSellOffer.amount,
      sellOffer: wronglyFundedSellOffer,
    })
  })

  it('sets up header correctly', () => {
    renderHook(useWrongFundingAmountSetup, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })

  it('confirms escrow', async () => {
    const { result } = renderHook(useWrongFundingAmountSetup, { wrapper })
    await result.current.confirmEscrow()
    expect(confirmEscrowMock).toHaveBeenCalledWith({ offerId: wronglyFundedSellOffer.id })
  })
  it('shows error banner when sell offer is not known', async () => {
    useOfferDetailsMock.mockReturnValueOnce({ offer: undefined })
    const { result } = renderHook(useWrongFundingAmountSetup, { wrapper })
    await result.current.confirmEscrow()
    expect(showErrorBannerMock).toHaveBeenCalledWith()
  })
})
