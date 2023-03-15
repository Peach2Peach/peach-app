import { strictEqual } from 'assert'
import { createWalletFromSeedPhrase, getNetwork, getPublicKeyForEscrow } from '.'

describe('getPublicKeyForEscrow', () => {
  it('returns wallet for escrow depending on offer id', () => {
    const network = getNetwork()
    const mnemonic = 'mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom'
    const expectedPublicKey = '03f54c36a63e6432f8744f4afc14ecf99d8882898d687878a1f972d89d01168e6c'
    const recoveredWallet = createWalletFromSeedPhrase(mnemonic, network)

    strictEqual(getPublicKeyForEscrow(recoveredWallet.wallet, '1'), expectedPublicKey)
  })
})
