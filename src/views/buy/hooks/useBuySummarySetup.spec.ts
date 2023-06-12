import { act, renderHook } from '@testing-library/react-native'
import { NavigationWrapper, headerState, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { getBuyOfferDraft } from '../helpers/getBuyOfferDraft'
import { useBuySummarySetup } from './useBuySummarySetup'

const isValidBitcoinSignatureMock = jest.fn().mockReturnValue(true)
jest.mock('../../../utils/validation', () => ({
  isValidBitcoinSignature: (...args: any[]) => isValidBitcoinSignatureMock(...args),
}))

const offerId = '123'
const publishBuyOfferMock = jest.fn().mockResolvedValue({ offerId, isOfferPublished: true, errorMessage: null })
jest.mock('../helpers/publishBuyOffer', () => ({
  publishBuyOffer: (...args: any[]) => publishBuyOfferMock(...args),
}))
describe('useBuySummarySetup', () => {
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })

  it('should set up header correctly', () => {
    renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should show offer published overlay when offer has been published successfully', async () => {
    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    await act(async () => {
      await result.current.publishOffer(
        getBuyOfferDraft({
          minBuyAmount: 1000,
          maxBuyAmount: 10000,
          meansOfPayment: {},
        }),
      )
    })
    expect(replaceMock).toHaveBeenCalledWith('offerPublished', { offerId, isSellOffer: false })
  })
})
