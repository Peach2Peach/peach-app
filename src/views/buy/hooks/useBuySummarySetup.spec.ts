import { act, renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
import { settingsStore } from '../../../store/settingsStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { getBuyOfferDraft } from '../helpers/getBuyOfferDraft'
import { useBuySummarySetup } from './useBuySummarySetup'
import { WalletIcon } from '../../../components/icons'

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
    expect(useHeaderState.getState().icons?.[0].iconComponent.type).toBe(WalletIcon)
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
})
