import { act, renderHook, waitFor } from 'test-utils'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { headerState, resetMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useSellSummarySetup } from './useSellSummarySetup'

jest.mock('../helpers/publishSellOffer', () => ({
  publishSellOffer: jest.fn().mockResolvedValue({
    isPublished: true,
    navigationParams: { offerId: sellOffer.id },
    errorMessage: null,
  }),
}))

describe('useSellSummarySetup', () => {
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })

  it('should set up header correctly', async () => {
    const { result } = renderHook(useSellSummarySetup)
    await waitFor(() => expect(result.current.canPublish).toBeTruthy())
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should navigate to funding screen after publishing', async () => {
    const { result } = renderHook(useSellSummarySetup)
    await act(async () => {
      await result.current.publishOffer()
    })
    expect(resetMock).toHaveBeenCalledWith({
      index: 1,
      routes: [
        { name: 'yourTrades', params: { tab: 'sell' } },
        { name: 'fundEscrow', params: { offerId: sellOffer.id } },
      ],
    })
  })
})
