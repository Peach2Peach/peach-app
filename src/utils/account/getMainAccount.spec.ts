import { networks } from 'bitcoinjs-lib'
import { createWalletFromBase58 } from '../wallet/createWalletFromBase58'
import { getMainAccount } from './getMainAccount'

describe('getMainAccount', () => {
  it('creates main interface for account', () => {
    const base58
      = 'tprv8ZgxMBicQKsPdu44Gqd9eC643bSfshHN7SBGaZopL1ynn6Zj4FX4E3t4WTKsS8BVafKeKXSyeQPpwUNQTJXwDHYdq5adc5NomoYTPwiYYMH'
    const expectedPrivateKey = 'ac284cf5aada8604e6d9adb9ce3d946b65d997636c144ad9f9652b342b50cf73'
    const expectedPublicKey = '02f110a3fccc8b38d3edf234822f667667019c0f93674c8365cd0e7517d2910196'
    const recoveredWallet = createWalletFromBase58(base58, networks.testnet)
    const mainAddress = getMainAccount(recoveredWallet, 'testnet')

    expect(mainAddress.network).toEqual(networks.testnet)
    expect(mainAddress.privateKey?.toString('hex')).toBe(expectedPrivateKey)
    expect(mainAddress.publicKey.toString('hex')).toBe(expectedPublicKey)
  })
})
