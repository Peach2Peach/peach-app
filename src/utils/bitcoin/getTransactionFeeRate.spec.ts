import { bitcoinTransaction } from '../../../tests/unit/data/transactionDetailData'
import { getTransactionFeeRate } from './getTransactionFeeRate'

describe('getTransactionFeeRate', () => {
  it('should calculate the fee rate', () => {
    const expectedFeeRate = 1.31
    expect(getTransactionFeeRate(bitcoinTransaction)).toBe(expectedFeeRate)
  })
})
