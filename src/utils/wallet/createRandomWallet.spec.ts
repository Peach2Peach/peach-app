import { deepStrictEqual, ok } from 'assert'
import { networks } from 'bitcoinjs-lib'
import { createRandomWallet, getNetwork } from '.'

describe('createRandomWallet', () => {
  it('creates a random new wallet', async () => {
    const network = getNetwork()
    const wallet1 = await createRandomWallet(network)
    const wallet2 = await createRandomWallet(network)

    ok(typeof wallet1.mnemonic === 'string', 'Mnemonic is not a string')
    deepStrictEqual(wallet1.wallet.network, networks.regtest, 'Network is not correct')
    ok(wallet1.mnemonic !== wallet2.mnemonic, 'Mnemonic are not different but should be')
    ok(
      wallet1.wallet.publicKey.toString('hex') !== wallet2.wallet.publicKey.toString('hex'),
      'Public keys are not different but should be',
    )
  })
})
