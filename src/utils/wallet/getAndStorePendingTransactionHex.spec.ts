import { walletStore } from './walletStore'
import { getAndStorePendingTransactionHex } from './getAndStorePendingTransactionHex'

const txHex = 'txHex'
const getTxHexMock = jest.fn().mockResolvedValue([txHex])
jest.mock('../electrum/getTxHex', () => ({
  getTxHex: (...args: any[]) => getTxHexMock(...args),
}))

describe('getAndStorePendingTransactionHex', () => {
  afterEach(() => {
    walletStore.getState().reset()
  })
  it('should fetch a hex of a tx it does not know', async () => {
    const txId = 'txId'
    const result = await getAndStorePendingTransactionHex(txId)
    expect(getTxHexMock).toHaveBeenCalledWith({ txId })
    expect(result).toBe(txHex)
    expect(walletStore.getState().pendingTransactions).toEqual({
      txId: txHex,
    })
  })
  it('should just return a hex of a tx it does already know', async () => {
    const pending = {
      txId1: 'txHex1',
    }
    walletStore.getState().addPendingTransactionHex('txId1', pending.txId1)

    const result = await getAndStorePendingTransactionHex('txId1')
    expect(getTxHexMock).not.toHaveBeenCalled()
    expect(result).toBe(pending.txId1)
  })
})
