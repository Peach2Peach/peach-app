import { renderHook, waitFor } from '@testing-library/react-native'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { getSellOfferDraft } from '../../../../tests/unit/data/offerDraftData'
import { headerState, NavigationWrapper, resetMock } from '../../../../tests/unit/helpers/NavigationWrapper'
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
  })

  it('should set up header correctly', async () => {
    const { result } = renderHook(useSellSummarySetup, { wrapper: NavigationWrapper })
    expect(headerState.header()).toMatchSnapshot()
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
