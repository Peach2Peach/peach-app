import { walletStore } from './walletStore'
import { rebroadcastTransactions } from './rebroadcastTransactions'

const txId = 'txId'
const postTxMock = jest.fn().mockResolvedValue([{ txId }])
jest.mock('../../peachAPI', () => ({
  postTx: (...args: any[]) => postTxMock(...args),
}))

describe('rebroadcastTransactions', () => {
  const pending = {
    txId1: 'txHex1',
    txId2: 'txHex2',
  }
  it('should rebroadcast transactions and remove it from the queue', async () => {
    walletStore.getState().addPendingTransactionHex('txId1', pending.txId1)
    walletStore.getState().addPendingTransactionHex('txId2', pending.txId2)
    await rebroadcastTransactions(pending)
    expect(postTxMock).toHaveBeenCalledWith({ tx: pending.txId1 })
    expect(postTxMock).toHaveBeenCalledWith({ tx: pending.txId2 })
    expect(walletStore.getState().pendingTransactions).toEqual({})
  })
})
