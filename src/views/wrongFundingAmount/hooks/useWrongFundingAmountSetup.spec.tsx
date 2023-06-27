import { renderHook, waitFor } from '@testing-library/react-native'
import { sellOffer, wronglyFundedSellOffer } from '../../../../tests/unit/data/offerData'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useWrongFundingAmountSetup } from './useWrongFundingAmountSetup'

const wrapper = ({ children }: ComponentProps) => (
  <NavigationWrapper>
    <QueryClientWrapper>{children}</QueryClientWrapper>
  </NavigationWrapper>
)

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

jest.useFakeTimers()

describe('useWrongFundingAmountSetup', () => {
  it('returns defaults', () => {
    useOfferDetailsMock.mockReturnValueOnce({ offer: undefined })
    const { result } = renderHook(useWrongFundingAmountSetup, { wrapper })
    expect(result.current).toEqual({
      sellOffer: undefined,
    })
  })
  it('returns funding information when sell offer is known', async () => {
    const { result } = renderHook(useWrongFundingAmountSetup, { wrapper })
    await waitFor(() => expect(result.current.sellOffer).toBeDefined())
    expect(result.current).toEqual({
      sellOffer: wronglyFundedSellOffer,
    })
  })

  it('sets up header correctly', () => {
    renderHook(useWrongFundingAmountSetup, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
})
