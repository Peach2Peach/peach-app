import { rebroadcastTransactions } from './rebroadcastTransactions'
import { useWalletState } from './walletStore'

const postTransactionMock = jest.fn()
jest.mock('../electrum/postTransaction', () => ({
  postTransaction: (...args: unknown[]) => postTransactionMock(...args),
}))

describe('rebroadcastTransactions', () => {
  const pending = {
    txId1: 'txHex1',
    txId2: 'txHex2',
  }

  afterEach(() => {
    useWalletState.getState().reset()
  })

  it('should rebroadcast transactions and remove it from the queue', async () => {
    useWalletState.getState().addPendingTransactionHex('txId1', pending.txId1)
    useWalletState.getState().addPendingTransactionHex('txId2', pending.txId2)
    postTransactionMock.mockResolvedValueOnce(['txId1'])
    postTransactionMock.mockResolvedValueOnce(['txId2'])
    await rebroadcastTransactions(Object.keys(pending))
    expect(postTransactionMock).toHaveBeenCalledWith({ tx: pending.txId1 })
    expect(postTransactionMock).toHaveBeenCalledWith({ tx: pending.txId2 })
    expect(useWalletState.getState().pendingTransactions).toEqual({})
  })
  it('should remove tx from queue if electrum says that the inputs have already been spent', async () => {
    useWalletState.getState().addPendingTransactionHex('txId1', pending.txId1)
    postTransactionMock.mockResolvedValueOnce([null, '{"code":-25,"message":"bad-txns-inputs-missingorspent"}'])
    await rebroadcastTransactions(['txId1'])
    expect(useWalletState.getState().pendingTransactions).toEqual({})
  })
})
