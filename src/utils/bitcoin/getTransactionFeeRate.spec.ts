/* eslint-disable no-magic-numbers */
import { bdkTransactionWithoutRBF1 } from '../../../tests/unit/data/transactionDetailData'
import { getTransactionFeeRate } from './getTransactionFeeRate'

describe('getTransactionFeeRate', () => {
  jest.spyOn(bdkTransactionWithoutRBF1.transaction, 'vsize').mockResolvedValue(347.25)
  it('should calculate the fee rate', async () => {
    const expectedFeeRate = 386.01

    expect(await getTransactionFeeRate(bdkTransactionWithoutRBF1)).toBe(expectedFeeRate)
  })
})
