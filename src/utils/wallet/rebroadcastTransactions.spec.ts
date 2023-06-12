import { walletStore } from './walletStore'
import { rebroadcastTransactions } from './rebroadcastTransactions'

const postTransactionMock = jest.fn()
jest.mock('../electrum/postTransaction', () => ({
  postTransaction: (...args: any[]) => postTransactionMock(...args),
}))

describe('rebroadcastTransactions', () => {
  const pending = {
    txId1: 'txHex1',
    txId2: 'txHex2',
  }

  afterEach(() => {
    walletStore.getState().reset()
  })

  it('should rebroadcast transactions and remove it from the queue', async () => {
    walletStore.getState().addPendingTransactionHex('txId1', pending.txId1)
    walletStore.getState().addPendingTransactionHex('txId2', pending.txId2)
    postTransactionMock.mockResolvedValueOnce(['txId1'])
    postTransactionMock.mockResolvedValueOnce(['txId2'])
    await rebroadcastTransactions(Object.keys(pending))
    expect(postTransactionMock).toHaveBeenCalledWith({ tx: pending.txId1 })
    expect(postTransactionMock).toHaveBeenCalledWith({ tx: pending.txId2 })
    expect(walletStore.getState().pendingTransactions).toEqual({})
  })
  it('should remove tx from queue if electrum says that the inputs have already been spent', async () => {
    walletStore.getState().addPendingTransactionHex('txId1', pending.txId1)
    postTransactionMock.mockResolvedValueOnce([null, '{"code":-25,"message":"bad-txns-inputs-missingorspent"}'])
    await rebroadcastTransactions(['txId1'])
    expect(walletStore.getState().pendingTransactions).toEqual({})
  })
})
