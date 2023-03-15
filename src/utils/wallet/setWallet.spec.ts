import { deepStrictEqual } from 'assert'
import { createWalletFromSeedPhrase, getNetwork, getWallet, setWallet } from '.'

describe('setWallet', () => {
  it('returns wallet for escrow depending on offer id', () => {
    const network = getNetwork()
    const mnemonic = 'mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom'
    const recoveredWallet = createWalletFromSeedPhrase(mnemonic, network)
    setWallet(recoveredWallet.wallet)

    deepStrictEqual(getWallet(), recoveredWallet.wallet)
  })
})
