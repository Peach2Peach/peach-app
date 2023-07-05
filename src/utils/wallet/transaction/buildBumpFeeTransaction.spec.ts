import { BumpFeeTxBuilder } from 'bdk-rn'
import { bumpFeeTxBuilderCreateMock, bumpFeeTxBuilderEnableRbfMock } from '../../../../tests/unit/mocks/bdkRN'
import { buildBumpFeeTransaction } from './buildBumpFeeTransaction'

describe('buildBumpFeeTransaction', () => {
  it('creates a bump fee transaction', async () => {
    const txId = 'txId'
    const feeRate = 10

    const transactionResult = await buildBumpFeeTransaction(txId, feeRate)
    expect(bumpFeeTxBuilderCreateMock).toHaveBeenCalledWith(txId, feeRate)
    expect(bumpFeeTxBuilderEnableRbfMock).toHaveBeenCalled()

    expect(transactionResult).toBeInstanceOf(BumpFeeTxBuilder)
  })
})
