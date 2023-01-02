import { ConfirmedTransaction } from 'bdk-rn/lib/lib/interfaces'
import { bitcoinStore } from '../../../../../src/store/bitcoinStore'
import { getOffer } from '../../../../../src/utils/offer'
import { getTransactionType, txIsConfirmed } from '../../../../../src/utils/transaction'
import { walletStore } from '../../../../../src/utils/wallet/walletStore'
import { getTxSummary } from '../../../../../src/views/wallet/helpers/getTxSummary'

jest.mock('../../../../../src/utils/offer', () => ({
  getOffer: jest.fn(),
}))
jest.mock('../../../../../src/utils/transaction', () => ({
  getTransactionType: jest.fn(),
  txIsConfirmed: jest.fn(),
}))
jest.mock('../../../../../src/store/bitcoinStore', () => ({
  bitcoinStore: {
    getState: jest.fn(),
  },
}))
jest.mock('../../../../../src/utils/wallet/walletStore', () => ({
  walletStore: {
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
      txOfferMap: {},
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns the correct transaction summary object for a confirmed trade', () => {
    ;(<jest.Mock>getOffer).mockReturnValue({
      id: '16',
    })
    ;(<jest.Mock>getTransactionType).mockReturnValue('TRADE')
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
