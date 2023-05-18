import { act, renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
import { settingsStore } from '../../../store/settingsStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { getBuyOfferDraft } from '../helpers/getBuyOfferDraft'
import { useBuySummarySetup } from './useBuySummarySetup'

const offerId = '123'
const publishBuyOfferMock = jest.fn().mockResolvedValue({ offerId, isOfferPublished: true, errorMessage: null })
jest.mock('../helpers/publishBuyOffer', () => ({
  publishBuyOffer: (...args: any[]) => publishBuyOfferMock(...args),
}))

describe('useBuySummarySetup', () => {
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
    jest.clearAllMocks()
  })

  it('should set up header correctly', async () => {
    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    expect(useHeaderState.getState().title).toBe('publish buy offer')
    await waitFor(() => expect(result.current.message).toBeDefined())
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

  it('should enable peach wallet if no payout address is set', async () => {
    settingsStore.getState().setPeachWalletActive(false)
    expect(settingsStore.getState().peachWalletActive).toBeFalsy()
    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    expect(settingsStore.getState().peachWalletActive).toBeTruthy()
    await waitFor(() => expect(result.current.messageSignature).toBeDefined())
  })
  it('should not enable peach wallet if payout address is set', () => {
    settingsStore.getState().setPeachWalletActive(false)
    settingsStore.getState().setPayoutAddress('payoutAddress')
    renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    expect(settingsStore.getState().peachWalletActive).toBeFalsy()
  })
  it('should navigate to signMessage', () => {
    const { result } = renderHook(useBuySummarySetup, { wrapper: NavigationWrapper })
    result.current.goToMessageSigning()
    expect(navigateMock).toHaveBeenCalledWith('signMessage')
  })
})
