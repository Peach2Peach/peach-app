import { ConfirmedTransaction } from 'bdk-rn/lib/lib/interfaces'
import { bitcoinStore } from '../../../store/bitcoinStore'
import { tradeSummaryStore } from '../../../store/tradeSummaryStore'
import { txIsConfirmed } from '../../../utils/transaction'
import { walletStore } from '../../../utils/wallet/walletStore'
import { getTxSummary } from './getTxSummary'

jest.mock('../../../utils/offer', () => ({
  getOffer: jest.fn(),
}))
jest.mock('../../../utils/transaction', () => ({
  ...jest.requireActual('../../../utils/transaction'),
  txIsConfirmed: jest.fn(),
}))

jest.mock('../../../store/bitcoinStore', () => ({
  bitcoinStore: {
    getState: jest.fn(),
  },
}))
jest.mock('../../../utils/wallet/walletStore', () => ({
  walletStore: {
    getState: jest.fn(),
  },
}))
jest.mock('../../../store/tradeSummaryStore', () => ({
  tradeSummaryStore: {
    getState: jest.fn(),
  },
}))

describe('getTxSummary', () => {
  beforeEach(() => {
    ;(<jest.Mock>bitcoinStore.getState).mockReturnValue({
      currency: 'USD',
      satsPerUnit: 100000000,
    })
    ;(<jest.Mock>walletStore.getState).mockReturnValue({
      txOfferMap: {
        '123': '16',
      },
    })
    ;(<jest.Mock>tradeSummaryStore.getState).mockReturnValue({
      offers: [
        {
          id: '16',
          type: 'bid',
        },
      ],
      getOffer: () => ({
        id: '16',
        type: 'bid',
      }),
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns the correct transaction summary object for a confirmed trade', () => {
    ;(<jest.Mock>(<unknown>txIsConfirmed)).mockReturnValue(true)
    const tx: Partial<ConfirmedTransaction> = {
      txid: '123',
      received: 100000000,
      sent: 0,
      block_timestamp: 1234567890,
    }
    const result = getTxSummary(tx as ConfirmedTransaction)
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
