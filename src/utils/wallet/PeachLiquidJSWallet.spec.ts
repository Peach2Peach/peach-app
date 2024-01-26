import { networks } from 'liquidjs-lib'
import { account1 } from '../../../tests/unit/data/accountData'
import { getError } from '../../../tests/unit/helpers/getError'
import { useAccountStore } from '../account/account'
import { PeachLiquidJSWallet } from './PeachLiquidJSWallet'
import { createWalletFromBase58 } from './createWalletFromBase58'
import { getNetwork } from './getNetwork'
import { useLiquidWalletState } from './useLiquidWalletState'

// eslint-disable-next-line max-lines-per-function
describe('PeachLiquidJSWallet', () => {
  const wallet = createWalletFromBase58(account1.base58, getNetwork())
  const message = 'message'
  let peachJSWallet: PeachLiquidJSWallet

  beforeEach(() => {
    useAccountStore.getState().setAccount(account1)
    peachJSWallet = new PeachLiquidJSWallet({ wallet })
  })
  afterEach(() => {
    useLiquidWalletState.getState().reset()
  })

  it('instantiates', () => {
    const addresses = ['address1', 'address2']
    useLiquidWalletState.getState().setAddresses(addresses)

    peachJSWallet = new PeachLiquidJSWallet({ wallet })

    expect(peachJSWallet.jsWallet).toEqual(wallet)
    expect(peachJSWallet.derivationPath).toEqual("m/84'/0'/0'")
    expect(peachJSWallet.addresses).toBe(addresses)
  })
  it('instantiates for mainnet', () => {
    peachJSWallet = new PeachLiquidJSWallet({ wallet, network: networks.liquid })

    expect(peachJSWallet.jsWallet).toEqual(wallet)
    expect(peachJSWallet.derivationPath).toEqual("m/84'/0'/0'")
  })

  it('finds key pair by address and stores scanned addresses', () => {
    const addressIndex = 3
    const address = peachJSWallet.getAddress(addressIndex)

    if (!address) throw Error()
    const keyPair = peachJSWallet.findKeyPairByAddress(address)
    expect(keyPair?.publicKey.toString('hex')).toBe('02cea67ce6aa1b6d0e7640568cc0aeb0b94a92c8b21735f8fb8d66041c449929a3')
    expect(peachJSWallet.addresses).toEqual([
      'ex1qcslk785zp5xqj5kjdawegsjglm039w56xzvqsh',
      'ex1qm6df88c6uaqrd565dcswfmuue7s9skym5g8yfq',
      'ex1q4uan5308xusfq7aqzjmwmpyjtj85sdwv0599e6',
      'ex1qht934aen9x48fvuq08rgrhtxs8jecklqdxmc9a',
    ])
  })

  it('signs an arbitrary message', () => {
    const address = 'ex1qcslk785zp5xqj5kjdawegsjglm039w56xzvqsh'
    const signature = peachJSWallet.signMessage(message, address)
    // eslint-disable-next-line max-len
    expect(signature).toBe('AkgwRQIhAMT8IZ7R7OOWm7mZf2xfXOatSuguIt0/inVgqwKuGhzmAiAmJ8gIbyOrmPhQu//Fv0fs0jGmd1vreQ4fmKgCx4vbXAEhAlDj2lYviHyAR0fUlMG6GqHmR9i2+n7fVSFZ7LRJ9cxJ')
  })
  it('signs an arbitrary message with index', () => {
    const address = 'ex1qcslk785zp5xqj5kjdawegsjglm039w56xzvqsh'
    const findKeyPairByAddressSpy = jest.spyOn(peachJSWallet, 'findKeyPairByAddress')
    const signature = peachJSWallet.signMessage(message, address, 0)
    expect(findKeyPairByAddressSpy).not.toHaveBeenCalled()
    // eslint-disable-next-line max-len
    expect(signature).toBe('AkgwRQIhAMT8IZ7R7OOWm7mZf2xfXOatSuguIt0/inVgqwKuGhzmAiAmJ8gIbyOrmPhQu//Fv0fs0jGmd1vreQ4fmKgCx4vbXAEhAlDj2lYviHyAR0fUlMG6GqHmR9i2+n7fVSFZ7LRJ9cxJ')
  })

  it('throws an error if address is not part of wallet', async () => {
    const address = 'bcrt1qdoesnotexist'
    const error = await getError<Error>(() => peachJSWallet.signMessage(message, address))
    expect(error.message).toBe('Address not part of wallet')
  })
})
