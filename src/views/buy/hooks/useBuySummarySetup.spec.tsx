import { act, renderHook } from '@testing-library/react-native'
import { account1 } from '../../../../tests/unit/data/accountData'
import { NavigationWrapper, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { setPaymentMethods } from '../../../paymentMethods'
import { PaymentMethodForbiddenPaypal } from '../../../popups/info/PaymentMethodForbiddenPaypal'
import { useConfigStore } from '../../../store/configStore'
import { usePopupStore } from '../../../store/usePopupStore'
import { setAccount } from '../../../utils/account'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useBuySummarySetup } from './useBuySummarySetup'

const publishBuyOfferMock = jest.fn().mockResolvedValue({ offerId: '123', isOfferPublished: true, errorMessage: null })
jest.mock('../helpers/publishBuyOffer', () => ({
  publishBuyOffer: (...args: unknown[]) => publishBuyOfferMock(...args),
}))

jest.mock('../../../utils/validation/isValidBitcoinSignature', () => ({
  isValidBitcoinSignature: jest.fn().mockReturnValue(true),
}))
describe('useBuySummarySetup', () => {
  beforeAll(() => {
    setPaymentMethods([{ id: 'paypal', currencies: ['EUR'], anonymous: false }])
  })
  beforeEach(() => {
    // @ts-expect-error mock doesn't need args
    setPeachWallet(new PeachWallet())
  })

  it('should show offer grouphug announcement if not seen before after publishing', async () => {
    useConfigStore.getState().setHasSeenGroupHugAnnouncement(false)
    setAccount({ ...account1, publicKey: '02d13a5d45bbbf5ef604f01530d22ce3a787c36a78bcb7bd57b2d90fd098686f37' })

    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    await act(() => result.current.publishOffer())
    expect(replaceMock).toHaveBeenCalledWith('groupHugAnnouncement', { offerId: '123' })
  })
  it('should show offer published overlay when offer has been published successfully', async () => {
    useConfigStore.getState().setHasSeenGroupHugAnnouncement(true)
    setAccount({ ...account1, publicKey: '02d13a5d45bbbf5ef604f01530d22ce3a787c36a78bcb7bd57b2d90fd098686f37' })

    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    await act(() => result.current.publishOffer())
    expect(replaceMock).toHaveBeenCalledWith('offerPublished', { offerId: '123', isSellOffer: false })
  })
  it('should publish the buy offer with the correct parameters', async () => {
    setAccount({ ...account1, publicKey: '02d13a5d45bbbf5ef604f01530d22ce3a787c36a78bcb7bd57b2d90fd098686f37' })

    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    await act(() => result.current.publishOffer())
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
  it('should open payment method forbidden popup for respective API error', async () => {
    setAccount({ ...account1, publicKey: '02d13a5d45bbbf5ef604f01530d22ce3a787c36a78bcb7bd57b2d90fd098686f37' })

    publishBuyOfferMock.mockResolvedValueOnce({ errorMessage: 'FORBIDDEN', errorDetails: ['paypal'] })
    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    await act(() => result.current.publishOffer())
    expect(result.current.isPublishing).toBe(false)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      content: <PaymentMethodForbiddenPaypal />,
    })
  })
})
