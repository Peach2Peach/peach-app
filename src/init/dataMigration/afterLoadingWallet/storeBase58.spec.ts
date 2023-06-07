import { account1 } from '../../../../tests/unit/data/accountData'
import { createTestWallet } from '../../../../tests/unit/helpers/createTestWallet'
import { storeIdentity } from '../../../utils/account'
import { storeBase58 } from './storeBase58'

jest.mock('../../../utils/account', () => ({
  storeIdentity: jest.fn(),
}))

describe('storeBase58', () => {
  const wallet = createTestWallet()
  it('updates payment data by enforcing format', () => {
    storeBase58(wallet, account1)
    expect(storeIdentity).toHaveBeenCalledWith({
      ...account1,
      base58: wallet.toBase58(),
    })
  })
})
