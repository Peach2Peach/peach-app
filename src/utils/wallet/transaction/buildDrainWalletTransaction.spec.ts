import { PartiallySignedTransaction, Transaction, TxBuilder } from 'bdk-rn'
import { TxBuilderResult } from 'bdk-rn/lib/classes/Bindings'
import { pending1 } from '../../../../tests/unit/data/transactionDetailData'
import {
  addressScriptPubKeyMock,
  psbtExtractTxMock,
  txBuilderCreateMock,
  txBuilderDrainToMock,
  txBuilderDrainWalletMock,
  txBuilderEnableRbfMock,
  txBuilderFeeRateMock,
  txBuilderFinishMock,
  walletSignMock,
} from '../../../../tests/unit/mocks/bdkRN'
import { buildDrainWalletTransaction } from './buildDrainWalletTransaction'

describe('buildDrainWalletTransaction', () => {
  it('creates a transaction that drains wallet', async () => {
    const address = 'address'
    const scriptPubKey = 'scriptPubKey'
    const feeRate = 10
    const result: TxBuilderResult = {
      psbt: new PartiallySignedTransaction('base64'),
      txDetails: pending1,
    }
    const transaction = await new Transaction().create([])
    addressScriptPubKeyMock.mockResolvedValueOnce(scriptPubKey)
    txBuilderFinishMock.mockResolvedValueOnce(result)
    walletSignMock.mockResolvedValueOnce(result.psbt)
    psbtExtractTxMock.mockResolvedValueOnce(transaction)
    const transactionResult = await buildDrainWalletTransaction(address, feeRate)
    expect(txBuilderCreateMock).toHaveBeenCalled()
    expect(txBuilderFeeRateMock).toHaveBeenCalledWith(feeRate)
    expect(txBuilderEnableRbfMock).toHaveBeenCalled()
    expect(txBuilderDrainWalletMock).toHaveBeenCalled()
    expect(txBuilderDrainToMock).toHaveBeenCalledWith(scriptPubKey)

    expect(transactionResult).toBeInstanceOf(TxBuilder)
  })
})
