import { TxBuilder } from 'bdk-rn'
import {
  addressScriptPubKeyMock,
  txBuilderCreateMock,
  txBuilderDrainToMock,
  txBuilderDrainWalletMock,
  txBuilderEnableRbfMock,
  txBuilderFeeRateMock,
} from '../../../../tests/unit/mocks/bdkRN'
import { buildDrainWalletTransaction } from './buildDrainWalletTransaction'

describe('buildDrainWalletTransaction', () => {
  it('creates a transaction that drains wallet', async () => {
    const address = 'address'
    const scriptPubKey = 'scriptPubKey'
    const feeRate = 10
    addressScriptPubKeyMock.mockResolvedValueOnce(scriptPubKey)
    const transactionResult = await buildDrainWalletTransaction(address, feeRate)
    expect(txBuilderCreateMock).toHaveBeenCalled()
    expect(txBuilderFeeRateMock).toHaveBeenCalledWith(feeRate)
    expect(txBuilderEnableRbfMock).toHaveBeenCalled()
    expect(txBuilderDrainWalletMock).toHaveBeenCalled()
    expect(txBuilderDrainToMock).toHaveBeenCalledWith(scriptPubKey)

    expect(transactionResult).toBeInstanceOf(TxBuilder)
  })
})
