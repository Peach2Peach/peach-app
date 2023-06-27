import { renderHook } from '@testing-library/react-native'
import { sellOffer } from '../../tests/unit/data/offerData'
import { NavigationWrapper } from '../../tests/unit/helpers/NavigationWrapper'
import { queryClient, QueryClientWrapper } from '../../tests/unit/helpers/QueryClientWrapper'
import { useHandleRefund } from './useHandleRefund'

jest.mock('../../../queryClient', () => ({
  queryClient,
}))

const getOfferDetailsMock = jest.fn().mockResolvedValue([sellOffer, null])
jest.mock('../../../utils/peachAPI', () => ({
  getOfferDetails: () => getOfferDetailsMock(),
  cancelOffer: jest.fn().mockResolvedValue([null, null]),
}))

const wrapper = ({ children }: { children: JSX.Element }) => (
  <QueryClientWrapper>
    <NavigationWrapper>{children}</NavigationWrapper>
  </QueryClientWrapper>
)

const showStartRefundPopupMock = jest.fn()
jest.mock('../../../popups/useStartRefundPopup', () => ({
  useStartRefundPopup: () => showStartRefundPopupMock,
}))

describe('useHandleRefund', () => {
  it('should return a function', () => {
    const { result } = renderHook(useHandleRefund, { wrapper })
    expect(result.current).toBeInstanceOf(Function)
  })

  it('should return false if tradeStatus is not refundTxSignatureRequired', async () => {
    const { result } = renderHook(useHandleRefund, { wrapper })
    const handleRefund = result.current
    const res = await handleRefund('tradeCompleted', 'offerId')
    expect(res).toBe(false)
  })

  it('should return false if sellOffer is not found', async () => {
    const { result } = renderHook(useHandleRefund, { wrapper })
    const handleRefund = result.current
    getOfferDetailsMock.mockResolvedValueOnce([null, null])
    const res = await handleRefund('refundTxSignatureRequired', 'offerId')
    expect(res).toBe(false)
  })

  it('should return false if sellOffer is not a sellOffer', async () => {
    const { result } = renderHook(useHandleRefund, { wrapper })
    const handleRefund = result.current
    getOfferDetailsMock.mockResolvedValueOnce([{}, null])
    const res = await handleRefund('refundTxSignatureRequired', 'offerId')
    expect(res).toBe(false)
  })

  it('should return true if sellOffer is found and is a sellOffer', async () => {
    const { result } = renderHook(useHandleRefund, { wrapper })
    const handleRefund = result.current
    const res = await handleRefund('refundTxSignatureRequired', 'offerId')
    expect(res).toBe(true)
  })

  it('should open the startRefundPopup if sellOffer is found and is a sellOffer', async () => {
    const { result } = renderHook(useHandleRefund, { wrapper })
    const handleRefund = result.current
    await handleRefund('refundTxSignatureRequired', 'offerId')
    expect(showStartRefundPopupMock).toHaveBeenCalledTimes(1)
  })

  it('should update the sellOffer in the queryClient if sellOffer is found and is a sellOffer', async () => {
    const { result } = renderHook(useHandleRefund, { wrapper })
    const handleRefund = result.current
    await handleRefund('refundTxSignatureRequired', sellOffer.id)
    expect(queryClient.getQueryData(['offer', sellOffer.id])).toEqual(sellOffer)
  })
})
