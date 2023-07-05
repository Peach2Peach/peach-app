import { renderHook } from '@testing-library/react-native'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { NavigationWrapper, resetMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useConfirmEscrow } from './useConfirmEscrow'
import { QueryClientWrapper, queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'

const apiSuccess = { success: true }
const unauthorizedError = { error: 'UNAUTHORIZED' }
const wrapper = ({ children }: { children: JSX.Element }) => (
  <QueryClientWrapper>
    <NavigationWrapper>{children}</NavigationWrapper>
  </QueryClientWrapper>
)
const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner:
    () =>
      (...args: any[]) =>
        showErrorBannerMock(...args),
}))

const confirmEscrowMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  confirmEscrow: (...args: any[]) => confirmEscrowMock(...args),
}))

describe('useConfirmEscrow', () => {
  const fundingStatusResponse = {
    offerId: sellOffer.id,
    escrow: 'escrow',
    funding: sellOffer.funding,
    returnAddress: sellOffer.returnAddress,
    userConfirmationRequired: true,
  }
  beforeEach(() => {
    queryClient.setQueryData(['fundingStatus', sellOffer.id], () => fundingStatusResponse)
  })
  afterEach(() => {
    queryClient.clear()
  })
  it('shows error banner if escrow could not be confirmed', async () => {
    confirmEscrowMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useConfirmEscrow, { wrapper })
    await result.current(sellOffer)
    expect(showErrorBannerMock).toHaveBeenCalledWith(unauthorizedError.error)
  })
  it('shows error banner if escrow server did not return result', async () => {
    confirmEscrowMock.mockResolvedValueOnce([null, null])
    const { result } = renderHook(useConfirmEscrow, { wrapper })
    await result.current(sellOffer)
    expect(showErrorBannerMock).toHaveBeenCalledWith(undefined)
  })
  it('confirms escrow and navigates to search if sell offer is funded', async () => {
    const { result } = renderHook(useConfirmEscrow, { wrapper })
    await result.current({ ...sellOffer, funding: { status: 'FUNDED' } as FundingStatus })
    expect(queryClient.getQueryData(['fundingStatus', sellOffer.id])).toEqual({
      ...fundingStatusResponse,
      userConfirmationRequired: false,
    })
    expect(resetMock).toHaveBeenCalledWith({
      index: 1,
      routes: [{ name: 'yourTrades' }, { name: 'search', params: { offerId: sellOffer.id } }],
    })
  })
  it('confirms escrow and navigates to fundEscrow if sell offer is not yet funded', async () => {
    const { result } = renderHook(useConfirmEscrow, { wrapper })
    await result.current({ ...sellOffer, funding: { status: 'MEMPOOL' } as FundingStatus })
    expect(queryClient.getQueryData(['fundingStatus', sellOffer.id])).toEqual({
      ...fundingStatusResponse,
      userConfirmationRequired: false,
    })
    expect(resetMock).toHaveBeenCalledWith({
      index: 1,
      routes: [{ name: 'yourTrades' }, { name: 'fundEscrow', params: { offerId: sellOffer.id } }],
    })
  })
})
