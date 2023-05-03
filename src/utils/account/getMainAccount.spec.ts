import { networks } from 'bitcoinjs-lib'
import { createWalletFromSeedPhrase } from '../wallet'
import { getMainAccount } from './getMainAccount'

describe('getMainAccount', () => {
  it('creates main interface for account', () => {
    const mnemonic = 'mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom'
    const expectedPrivateKey = 'ac284cf5aada8604e6d9adb9ce3d946b65d997636c144ad9f9652b342b50cf73'
    const expectedPublicKey = '02f110a3fccc8b38d3edf234822f667667019c0f93674c8365cd0e7517d2910196'
    const recoveredWallet = createWalletFromSeedPhrase(mnemonic, networks.testnet)

    const mainAddress = getMainAccount(recoveredWallet.wallet, 'testnet')

    expect(mainAddress.network).toEqual(networks.testnet)
    expect(mainAddress.privateKey?.toString('hex')).toBe(expectedPrivateKey)
    expect(mainAddress.publicKey.toString('hex')).toBe(expectedPublicKey)
  })
})
