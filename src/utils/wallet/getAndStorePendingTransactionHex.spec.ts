import { BlockTime, TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { Transaction } from 'bdk-rn/lib/classes/Transaction'
import { storePendingTransactionHex } from './getAndStorePendingTransactionHex'
import { useWalletState } from './walletStore'

describe('getAndStorePendingTransactionHex', () => {
  const txId = 'txId'
  const blockTime = new BlockTime(1, Date.now())
  const transaction = new Transaction()
  const serialized = [1, 2, 3, 4]
  transaction.serialize = jest.fn().mockResolvedValue(serialized)
  const expectedHex = '01020304'
  const tx = new TransactionDetails(txId, 0, 10000, 2, blockTime, transaction)

  afterEach(() => {
    useWalletState.getState().reset()
  })
  it('should fetch a hex of a tx it does not know', async () => {
    const result = await storePendingTransactionHex(tx)
    expect(result).toBe(expectedHex)
    expect(useWalletState.getState().pendingTransactions).toEqual({ txId: expectedHex })
  })
  it('should just return a hex of a tx it does already know', async () => {
    const pending = { txId1: txId }
    useWalletState.getState().addPendingTransactionHex(txId, pending.txId1)

    const result = await storePendingTransactionHex(tx)
    expect(result).toBe(pending.txId1)
  })
})
