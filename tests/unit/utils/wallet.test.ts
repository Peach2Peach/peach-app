import { networks } from 'bitcoinjs-lib'
import { deepStrictEqual, strictEqual, ok } from 'assert'
import {
  getNetwork,
  createWallet,
  wallet,
  getWallet,
  setWallet,
  getMainAddress,
  getEscrowWallet,
  getPublicKeyForEscrow,
  // getFinalScript,
} from '../../../src/utils/wallet'


describe('wallet & getWallet & setWallet', () => {
  it('returns wallet for escrow depending on offer id', async () => {
    const mnemonic = 'mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom'
    const recoveredWallet = await createWallet(mnemonic)
    setWallet(recoveredWallet.wallet)

    deepStrictEqual(getWallet(), recoveredWallet.wallet)
    deepStrictEqual(wallet, recoveredWallet.wallet)
  })
})

describe('getNetwork', () => {
  it('returns network provided in .env', () => {
    deepStrictEqual(getNetwork(), networks.regtest)
  })
})

describe('createWallet', () => {
  it('creates a random new wallet', async () => {
    const wallet1 = await createWallet()
    const wallet2 = await createWallet()

    ok(typeof wallet1.mnemonic === 'string', 'Mnemonic is not a string')
    deepStrictEqual(wallet1.wallet.network, networks.regtest, 'Network is not correct')
    ok(wallet1.mnemonic !== wallet2.mnemonic, 'Mnemonic are not different but should be')
    ok(
      wallet1.wallet.publicKey.toString('hex') !== wallet2.wallet.publicKey.toString('hex'),
      'Public keys are not different but should be'
    )
  })
  it('recovers a wallet from mnemonic', async () => {
    const mnemonic = 'mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom'
    const expectedPrivateKey = 'ba4e90a60a8a6a7df66f0158e529e38fd3bea2b6b75b1f5007da6d47942b43cc'
    const expectedPublicKey = '02e327f0e1669a6c9aa052c861ba13a966972d1ba6b2e4f793c9a1ce4b06950231'
    const recoveredWallet = await createWallet(mnemonic)

    strictEqual(recoveredWallet.mnemonic, mnemonic)
    deepStrictEqual(recoveredWallet.wallet.network, networks.regtest, 'Network is not correct')
    strictEqual(recoveredWallet.wallet.privateKey.toString('hex'), expectedPrivateKey)
    strictEqual(recoveredWallet.wallet.publicKey.toString('hex'), expectedPublicKey)
  })
})

describe('getEscrowWallet', () => {
  it('returns wallet for escrow depending on offer id', async () => {
    const mnemonic = 'mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom'
    const expectedPrivateKey = 'a441c169d244e92d6e254a6ed2877372dd679aebd0b4177ed349ba5efeaf75a4'
    const expectedPublicKey = '03f54c36a63e6432f8744f4afc14ecf99d8882898d687878a1f972d89d01168e6c'
    const recoveredWallet = await createWallet(mnemonic)
    setWallet(recoveredWallet.wallet)

    const escrowWallet = getEscrowWallet('1')

    deepStrictEqual(escrowWallet.network, networks.regtest, 'Network is not correct')
    strictEqual(escrowWallet.privateKey?.toString('hex'), expectedPrivateKey)
    strictEqual(escrowWallet.publicKey.toString('hex'), expectedPublicKey)
  })
})

describe('getMainAddress', () => {
  it('returns wallet for escrow depending on offer id', async () => {
    const mnemonic = 'mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom'
    const expectedPrivateKey = 'ac284cf5aada8604e6d9adb9ce3d946b65d997636c144ad9f9652b342b50cf73'
    const expectedPublicKey = '02f110a3fccc8b38d3edf234822f667667019c0f93674c8365cd0e7517d2910196'
    const recoveredWallet = await createWallet(mnemonic)

    const mainAddress = getMainAddress(recoveredWallet.wallet)

    deepStrictEqual(mainAddress.network, networks.regtest, 'Network is not correct')
    strictEqual(mainAddress.privateKey?.toString('hex'), expectedPrivateKey)
    strictEqual(mainAddress.publicKey.toString('hex'), expectedPublicKey)
  })
})

describe('getPublicKeyForEscrow', () => {
  it('returns wallet for escrow depending on offer id', async () => {
    const mnemonic = 'mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom mom'
    const expectedPublicKey = '03f54c36a63e6432f8744f4afc14ecf99d8882898d687878a1f972d89d01168e6c'
    const recoveredWallet = await createWallet(mnemonic)
    setWallet(recoveredWallet.wallet)

    strictEqual(getPublicKeyForEscrow('1'), expectedPublicKey)
  })
})
