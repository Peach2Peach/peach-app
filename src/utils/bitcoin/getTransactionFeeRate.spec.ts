import { bitcoinTransaction } from '../../../tests/unit/data/transactionDetailData'
import { getTransactionFeeRate } from './getTransactionFeeRate'

describe('getTransactionFeeRate', () => {
  it('should calculate the fee rate', () => {
    expect(getTransactionFeeRate(bitcoinTransaction)).toBeCloseTo(1.31, 2)
  })
})
