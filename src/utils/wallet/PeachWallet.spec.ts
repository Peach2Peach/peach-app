import { account1 } from '../../../tests/unit/data/accountData'
import { PeachWallet } from './PeachWallet'
import { createWalletFromSeedPhrase } from './createWalletFromSeedPhrase'
import { getNetwork } from './getNetwork'
import { walletStore } from './walletStore'

jest.mock('./PeachWallet', () => jest.requireActual('./PeachWallet'))

describe('PeachWallet', () => {
  const { wallet } = createWalletFromSeedPhrase(account1.mnemonic!, getNetwork())
  it('instantiates', () => {
    const peachWallet = new PeachWallet({ wallet })
    expect(peachWallet.initialized).toBeFalsy()
    expect(peachWallet.synced).toBeFalsy()
    expect(peachWallet.wallet).toEqual(wallet)
  })
  it('load existing data', () => {
    const peachWallet = new PeachWallet({ wallet })
    const balance = 50000
    const addresses = ['address1', 'address2']
    walletStore.getState().setBalance(balance)
    walletStore.getState().setAddresses(addresses)
    peachWallet.loadWallet()
    expect(peachWallet.balance).toBe(balance)
    expect(peachWallet.addresses).toBe(addresses)
  })
  it('load existing when wallet store is ready', () => {
    const peachWallet = new PeachWallet({ wallet })
    const balance = 50000
    const addresses = ['address1', 'address2']
    const hasHydratedSpy = jest.spyOn(walletStore.persist, 'hasHydrated')
    const onFinishHydrationSpy = jest.spyOn(walletStore.persist, 'onFinishHydration')
    hasHydratedSpy.mockReturnValueOnce(false)
    // @ts-ignore
    onFinishHydrationSpy.mockImplementationOnce((cb) => cb(walletStore.getState()))
    walletStore.getState().setBalance(balance)
    walletStore.getState().setAddresses(addresses)
    peachWallet.loadWallet()
    expect(peachWallet.balance).toBe(balance)
    expect(peachWallet.addresses).toBe(addresses)
  })
  it('finds key pair by address and stores scanned addresses', () => {
    const peachWallet = new PeachWallet({ wallet })
    const address = peachWallet.getAddress(3)

    if (!address) throw Error()
    const keyPair = peachWallet.findKeyPairByAddress(address)
    expect(keyPair?.publicKey.toString('hex')).toBe('03f5c7061bd2ca963c20edc0f8e09c42a9a5b35df3f708d3339446f1d00656b67c')
    expect(peachWallet.addresses).toEqual([
      'bcrt1q7jyvzs6yu9wz8qzmcwyruw0e652xhyhkdw5qrt',
      'bcrt1qgt4a6p3z8nr2a9snvlmd7vl0vqytq2l757gmn2',
      'bcrt1qfvss2z90h0cpwyp8tvtxytqjmrhdq0ltfacxgx',
      'bcrt1qupwsjlw68j596em27078uglyf8net95ddyr9ev',
    ])
  })
})
