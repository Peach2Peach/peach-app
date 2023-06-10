import { act, renderHook, waitFor } from '@testing-library/react-native'
import { headerState, NavigationWrapper, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useBuySummarySetup } from './useBuySummarySetup'

jest.mock('../helpers/publishBuyOffer', () => ({
  publishBuyOffer: jest.fn().mockResolvedValue({ offerId: '123', isOfferPublished: true, errorMessage: null }),
}))

jest.mock('../../../utils/validation', () => ({
  isValidBitcoinSignature: jest.fn().mockReturnValue(true),
}))
describe('useBuySummarySetup', () => {
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
    jest.clearAllMocks()
  })

  it('should set up header correctly', async () => {
    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    await waitFor(() => {
      expect(result.current.canPublish).toBe(true)
    })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should show offer published overlay when offer has been published successfully', async () => {
    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    await act(async () => {
      await result.current.publishOffer()
    })
    expect(replaceMock).toHaveBeenCalledWith('offerPublished', { offerId: '123', isSellOffer: false })
  })
})
