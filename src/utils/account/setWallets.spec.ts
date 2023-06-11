import { account1 } from '../../../tests/unit/data/accountData'
import { createTestWallet } from '../../../tests/unit/helpers/createTestWallet'
import { getPeachAccount } from '../peachAPI/peachAccount'
import { PeachWallet } from '../wallet/PeachWallet'
import { setWallets } from './setWallets'

describe('setWallets', () => {
  const loadWalletSpy = jest.spyOn(PeachWallet.prototype, 'loadWallet')
  const wallet = createTestWallet()

  beforeAll(() => {
    // @ts-ignore
    setWallets(wallet, account1.mnemonic)
  })

  it('loads peach account', () => {
    expect(getPeachAccount()?.privateKey?.toString('hex')).toBe(
      'ac284cf5aada8604e6d9adb9ce3d946b65d997636c144ad9f9652b342b50cf73',
    )
  })
  it('loads peach wallets', () => {
    expect(loadWalletSpy).toHaveBeenCalledWith(account1.mnemonic)
  })
})
