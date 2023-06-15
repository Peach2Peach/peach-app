import { act, renderHook } from '@testing-library/react-native'
import { NavigationWrapper, headerState, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useBuySummarySetup } from './useBuySummarySetup'
import { setAccount } from '../../../utils/account'
import { account1 } from '../../../../tests/unit/data/accountData'

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
  })

  it('should set up header correctly', () => {
    renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should show offer published overlay when offer has been published successfully', async () => {
    setAccount({ ...account1, publicKey: '02d13a5d45bbbf5ef604f01530d22ce3a787c36a78bcb7bd57b2d90fd098686f37' })

    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    await act(async () => {
      await result.current.publishOffer()
    })
    expect(replaceMock).toHaveBeenCalledWith('offerPublished', { offerId: '123', isSellOffer: false })
  })
})
