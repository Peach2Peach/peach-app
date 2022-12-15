import { deepStrictEqual, strictEqual } from 'assert'
import { createWalletFromSeedPhrase, getEscrowWallet, getNetwork } from '../../../../src/utils/wallet'

describe('getEscrowWallet', () => {
  it('returns wallet for escrow depending on offer id', () => {
    const network = getNetwork()
    const mnemonic = 'mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom'
    const expectedPrivateKey = 'a441c169d244e92d6e254a6ed2877372dd679aebd0b4177ed349ba5efeaf75a4'
    const expectedPublicKey = '03f54c36a63e6432f8744f4afc14ecf99d8882898d687878a1f972d89d01168e6c'
    const recoveredWallet = createWalletFromSeedPhrase(mnemonic, network)

    const escrowWallet = getEscrowWallet(recoveredWallet.wallet, '1')

    deepStrictEqual(escrowWallet.network, network, 'Network is not correct')
    strictEqual(escrowWallet.privateKey?.toString('hex'), expectedPrivateKey)
    strictEqual(escrowWallet.publicKey.toString('hex'), expectedPublicKey)
  })
})
