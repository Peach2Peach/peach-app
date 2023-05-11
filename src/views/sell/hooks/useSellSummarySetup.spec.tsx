import { renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper, resetMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useSellSummarySetup } from './useSellSummarySetup'
import { settingsStore } from '../../../store/settingsStore'
import { getSellOfferDraft } from '../../../../tests/unit/data/offerDraftData'
import { sellOffer } from '../../../../tests/unit/data/offerData'

const publishSellOfferMock = jest.fn().mockResolvedValue({
  isPublished: true,
  navigationParams: { offerId: sellOffer.id },
  errorMessage: null,
})
jest.mock('../helpers/publishSellOffer', () => ({
  publishSellOffer: (...args: any[]) => publishSellOfferMock(...args),
}))

describe('useSellSummarySetup', () => {
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
    jest.clearAllMocks()
  })

  it('should set up header correctly', async () => {
    const { result } = renderHook(useSellSummarySetup, { wrapper: NavigationWrapper })
    expect(useHeaderState.getState().title).toBe('sell offer summary')
    expect(useHeaderState.getState().icons?.[0].id).toBe('wallet')
    await waitFor(() => expect(result.current.returnAddress).toBeDefined())
  })
  it('should enable peach wallet if no payout address is set', () => {
    settingsStore.getState().setPeachWalletActive(false)
    expect(settingsStore.getState().peachWalletActive).toBeFalsy()
    renderHook(useSellSummarySetup, { wrapper: NavigationWrapper })
    expect(settingsStore.getState().peachWalletActive).toBeTruthy()
  })
  it('should not enable peach wallet if payout address is set', () => {
    settingsStore.getState().setPeachWalletActive(false)
    settingsStore.getState().setPayoutAddress('payoutAddress')
    renderHook(useSellSummarySetup, { wrapper: NavigationWrapper })
    expect(settingsStore.getState().peachWalletActive).toBeFalsy()
  })
  it('should navigate to funding screen after publishing', async () => {
    const { result } = renderHook(useSellSummarySetup, { wrapper: NavigationWrapper })
    await result.current.publishOffer(getSellOfferDraft())
    expect(resetMock).toHaveBeenCalledWith({
      index: 1,
      routes: [
        { name: 'yourTrades', params: { tab: 'sell' } },
        { name: 'fundEscrow', params: { offerId: sellOffer.id } },
      ],
    })
  })
})
