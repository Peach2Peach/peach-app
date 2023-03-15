import { deepStrictEqual, strictEqual } from 'assert'
import { createWalletFromSeedPhrase, getMainAddress, getNetwork } from '.'

describe('getMainAddress', () => {
  it('returns wallet for escrow depending on offer id', () => {
    const network = getNetwork()
    const mnemonic = 'mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom'
    const expectedPrivateKey = 'ac284cf5aada8604e6d9adb9ce3d946b65d997636c144ad9f9652b342b50cf73'
    const expectedPublicKey = '02f110a3fccc8b38d3edf234822f667667019c0f93674c8365cd0e7517d2910196'
    const recoveredWallet = createWalletFromSeedPhrase(mnemonic, network)

    const mainAddress = getMainAddress(recoveredWallet.wallet)

    deepStrictEqual(mainAddress.network, network, 'Network is not correct')
    strictEqual(mainAddress.privateKey?.toString('hex'), expectedPrivateKey)
    strictEqual(mainAddress.publicKey.toString('hex'), expectedPublicKey)
  })
})
