import { act, renderHook } from '@testing-library/react-native'
import { NavigationWrapper, headerState, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useBuySummarySetup } from './useBuySummarySetup'
import { setAccount } from '../../../utils/account'
import { account1 } from '../../../../tests/unit/data/accountData'

const publishBuyOfferMock = jest.fn().mockResolvedValue({ offerId: '123', isOfferPublished: true, errorMessage: null })
jest.mock('../helpers/publishBuyOffer', () => ({
  publishBuyOffer: (...args: unknown[]) => publishBuyOfferMock(...args),
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
  it('should publish the buy offer with the correct parameters', async () => {
    setAccount({ ...account1, publicKey: '02d13a5d45bbbf5ef604f01530d22ce3a787c36a78bcb7bd57b2d90fd098686f37' })

    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    await act(async () => {
      await result.current.publishOffer()
    })
    expect(result.current.isPublishing).toBe(false)
    expect(publishBuyOfferMock).toHaveBeenCalledWith({
      amount: [0, Infinity],
      meansOfPayment: {},
      message: 'I confirm that only I, peach02d13a5d, control the address bcrt1qwype5wug33a6hwz9u2n6vz4lc0kpw0kg4xc8fq',
      messageSignature: 'IH9ZjMHG1af6puAITFTdV5RSYoK1MNmecZdhW0s4soh4EIAz4igtVQTec5yj4H9Iy7sB6qYReRjGpE3b4OoXSLY',
      originalPaymentData: [],
      paymentData: {},
      releaseAddress: 'bcrt1qwype5wug33a6hwz9u2n6vz4lc0kpw0kg4xc8fq',
      type: 'bid',
      walletLabel: 'Peach wallet',
      maxPremium: null,
    })
  })
})
