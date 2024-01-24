import { account1 } from '../../../tests/unit/data/accountData'
import { loadAccountFromBase58 } from './loadAccountFromBase58'

describe('loadAccountFromBase58', () => {
  const privateKey = '80d12e8d17542fdc2377089de363ea716ebf7fd5fcad522d6a1e7bfa33e239e5'

  it('returns wallet', () => {
    const wallet = loadAccountFromBase58(account1.base58)

    expect(wallet.privateKey?.toString('hex')).toBe(privateKey)
  })
})
