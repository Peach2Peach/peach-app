import { dataMigrationAfterLoadingWallet } from './dataMigrationAfterLoadingWallet'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'

const storeBase58Mock = jest.fn()
jest.mock('./afterLoadingWallet/storeBase58', () => ({
  storeBase58: (...args: any[]) => storeBase58Mock(...args),
}))

describe('dataMigrationAfterLoadingWallet', () => {
  const account = {
    publicKey: '',
  } as Account
  const wallet = createTestWallet()

  it('should call storeBase58', async () => {
    await dataMigrationAfterLoadingWallet(wallet, account)
    expect(storeBase58Mock).toHaveBeenCalledWith(wallet, account)
  })
})
