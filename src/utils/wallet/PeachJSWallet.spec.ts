import { account1 } from '../../../tests/unit/data/accountData'
import { getError } from '../../../tests/unit/helpers/getError'
import { PeachJSWallet } from './PeachJSWallet'
import { createWalletFromBase58 } from './createWalletFromBase58'
import { getNetwork } from './getNetwork'
import { useWalletState } from './walletStore'

describe('PeachJSWallet', () => {
  // @ts-ignore
  const wallet = createWalletFromBase58(account1.base58, getNetwork())
  const message = 'message'
  let peachJSWallet: PeachJSWallet

  beforeEach(() => {
    peachJSWallet = new PeachJSWallet({ wallet })
  })
  afterEach(() => {
    useWalletState.getState().reset()
  })

  it('instantiates', () => {
    const addresses = ['address1', 'address2']
    useWalletState.getState().setAddresses(addresses)

    peachJSWallet = new PeachJSWallet({ wallet })

    expect(peachJSWallet.jsWallet).toEqual(wallet)
    expect(peachJSWallet.derivationPath).toEqual("m/84'/1'/0'")
    expect(peachJSWallet.addresses).toBe(addresses)
  })
  it('instantiates for mainnet', () => {
    peachJSWallet = new PeachJSWallet({ wallet, network: 'bitcoin' })

    expect(peachJSWallet.jsWallet).toEqual(wallet)
    expect(peachJSWallet.derivationPath).toEqual("m/84'/0'/0'")
  })

  it('finds key pair by address and stores scanned addresses', () => {
    const address = peachJSWallet._getAddress(3)

    if (!address) throw Error()
    const keyPair = peachJSWallet.findKeyPairByAddress(address)
    expect(keyPair?.publicKey.toString('hex')).toBe('03f5c7061bd2ca963c20edc0f8e09c42a9a5b35df3f708d3339446f1d00656b67c')
    expect(peachJSWallet.addresses).toEqual([
      'bcrt1q7jyvzs6yu9wz8qzmcwyruw0e652xhyhkdw5qrt',
      'bcrt1qgt4a6p3z8nr2a9snvlmd7vl0vqytq2l757gmn2',
      'bcrt1qfvss2z90h0cpwyp8tvtxytqjmrhdq0ltfacxgx',
      'bcrt1qupwsjlw68j596em27078uglyf8net95ddyr9ev',
    ])
  })

  it('signs an arbitrary message', () => {
    const address = 'bcrt1q7jyvzs6yu9wz8qzmcwyruw0e652xhyhkdw5qrt'
    const signature = peachJSWallet.signMessage(message, address)
    expect(signature).toBe('H/3SBIrDhI686xf6q40H1aQCI9DHF1zD4YKHuG3Efq8XK3rDDA0zYCQQ31XERBZqEq+2DUOupYYCIahvYOwbJ3s=')
  })
  it('signs an arbitrary message with index', () => {
    const address = 'bcrt1q7jyvzs6yu9wz8qzmcwyruw0e652xhyhkdw5qrt'
    const findKeyPairByAddressSpy = jest.spyOn(peachJSWallet, 'findKeyPairByAddress')
    const signature = peachJSWallet.signMessage(message, address, 1)
    expect(findKeyPairByAddressSpy).not.toHaveBeenCalled()
    expect(signature).toBe('H1cN5gQpMeLAsid1ZnUIJxEVC5+geRao9yeT9V88rtHfe4bEvglz8hSwnWCuMjjHHYCgBGKssceWPUQKKrpThRE=')
  })
  it('signs an arbitrary message with index 0', () => {
    const address = 'bcrt1q7jyvzs6yu9wz8qzmcwyruw0e652xhyhkdw5qrt'
    const findKeyPairByAddressSpy = jest.spyOn(peachJSWallet, 'findKeyPairByAddress')
    const signature = peachJSWallet.signMessage(message, address, 0)
    expect(findKeyPairByAddressSpy).not.toHaveBeenCalled()
    expect(signature).toBe('H/3SBIrDhI686xf6q40H1aQCI9DHF1zD4YKHuG3Efq8XK3rDDA0zYCQQ31XERBZqEq+2DUOupYYCIahvYOwbJ3s=')
  })
  it('throws an error if address is not part of wallet', async () => {
    const address = 'bcrt1qdoesnotexist'
    const error = await getError<Error>(() => peachJSWallet.signMessage(message, address))
    expect(error.message).toBe('Address not part of wallet')
  })
})
