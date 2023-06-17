import { bitcoinStore } from '../../../store/bitcoinStore'
import { tradeSummaryStore } from '../../../store/tradeSummaryStore'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { getTxSummary } from './getTxSummary'

jest.mock('../../../utils/offer', () => ({
  getOffer: jest.fn(),
}))
jest.mock('../../../utils/transaction/txIsConfirmed', () => ({
  txIsConfirmed: jest.fn(() => true),
}))

describe('getTxSummary', () => {
  beforeEach(() => {
    bitcoinStore.setState({
      currency: 'USD',
      satsPerUnit: 100000000,
    })
    useWalletState.setState({
      txOfferMap: {
        '123': '16',
      },
    })
    tradeSummaryStore.setState({
      offers: [
        // @ts-ignore
        {
          id: '16',
          type: 'bid',
        },
      ],
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns the correct transaction summary object for a confirmed trade', () => {
    const tx = {
      txid: '123',
      received: 100000000,
      sent: 0,
      confirmationTime: {
        height: 1,
        timestamp: 1234567890,
      },
    }
    const result = getTxSummary(tx)
    expect(result).toEqual({
      id: '123',
      offerId: '16',
      type: 'TRADE',
      amount: 100000000,
      price: 1,
      currency: 'USD',
      date: new Date(1234567890000),
      confirmed: true,
    })
  })
})
