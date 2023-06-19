import { TxBuilder } from 'bdk-rn'
import {
  addressScriptPubKeyMock,
  txBuilderAddRecipientMock,
  txBuilderCreateMock,
  txBuilderEnableRbfMock,
  txBuilderFeeRateMock,
} from '../../../../tests/unit/mocks/bdkRN'
import { buildTransaction } from './buildTransaction'

describe('buildTransaction', () => {
  it('builds a transaction with an amount, fee rate, recipientAddress and rbf enabled', async () => {
    const address = 'address'
    const amount = 21000000
    const scriptPubKey = 'scriptPubKey'
    const feeRate = 10

    addressScriptPubKeyMock.mockResolvedValueOnce(scriptPubKey)
    const transactionResult = await buildTransaction(address, amount, feeRate)
    expect(txBuilderCreateMock).toHaveBeenCalled()
    expect(txBuilderFeeRateMock).toHaveBeenCalledWith(feeRate)
    expect(txBuilderEnableRbfMock).toHaveBeenCalled()
    expect(txBuilderAddRecipientMock).toHaveBeenCalledWith(scriptPubKey, amount)

    expect(transactionResult).toBeInstanceOf(TxBuilder)
  })
})
