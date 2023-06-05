import { account1 } from '../../../tests/unit/data/accountData'
import { getPeachAccount } from '../peachAPI/peachAccount'
import { PeachWallet } from '../wallet/PeachWallet'
import { wallet } from '../wallet/setWallet'
import { loadAccountFromSeedPhrase } from './loadAccountFromSeedPhrase'

describe('loadAccountFromSeedPhrase', () => {
  const loadWalletSpy = jest.spyOn(PeachWallet.prototype, 'loadWallet')

  beforeAll(() => {
    loadAccountFromSeedPhrase(account1.mnemonic!)
  })

  it('loads peach account', () => {
    expect(getPeachAccount()?.privateKey?.toString('hex')).toBe(
      '62233e988e4ca00c3b346b4753c7dc316f6ce39280410072ddab298f36a7fe64',
    )
  })
  it('loads peach wallets', () => {
    const privateKey = '80d12e8d17542fdc2377089de363ea716ebf7fd5fcad522d6a1e7bfa33e239e5'
    expect(wallet.privateKey?.toString('hex')).toBe(privateKey)
    expect(loadWalletSpy).toHaveBeenCalledWith(account1.mnemonic)
  })
})
