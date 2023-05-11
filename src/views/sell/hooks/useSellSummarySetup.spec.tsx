import { renderHook, waitFor } from '@testing-library/react-native'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { getSellOfferDraft } from '../../../../tests/unit/data/offerDraftData'
import { NavigationWrapper, resetMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
import { WalletIcon } from '../../../components/icons'
import { settingsStore } from '../../../store/settingsStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useSellSummarySetup } from './useSellSummarySetup'

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
    expect(useHeaderState.getState().icons?.[0].iconComponent.type).toBe(WalletIcon)
    await waitFor(() => expect(result.current.returnAddress).toBeDefined())
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
