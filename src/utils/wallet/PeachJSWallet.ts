import { NETWORK } from '@env'
import { BIP32Interface } from 'bip32'
import { Network, networks, payments } from 'bitcoinjs-lib'
import { sign } from 'bitcoinjs-message'
import { info } from '../log/info'
import { getNetwork } from './getNetwork'
import { useWalletState } from './walletStore'

type PeachJSWalletProps = {
  wallet: BIP32Interface
  network?: BitcoinNetwork
  gapLimit?: number
}
const GAP_LIMIT = 25
export class PeachJSWallet {
  jsWallet: BIP32Interface

  network: BitcoinNetwork

  derivationPath: string

  gapLimit: number

  addresses: string[]

  constructor ({ wallet, network = NETWORK, gapLimit = GAP_LIMIT }: PeachJSWalletProps) {
    this.jsWallet = wallet

    this.network = network
    this.gapLimit = gapLimit
    this.addresses = useWalletState.getState().addresses

    this.derivationPath = `m/84'/${network === 'bitcoin' ? '0' : '1'}'/0'`
  }

  getKeyPair (index: number) {
    return this.jsWallet.derivePath(`${this.derivationPath}/0/${index}`)
  }

  _getAddress (index: number) {
    info('PeachWallet - getAddress', index)

    if (this.addresses[index]) return this.addresses[index]

    const keyPair = this.getKeyPair(index)
    const p2wpkh = payments.p2wpkh({
      network: getNetwork(),
      pubkey: keyPair.publicKey,
    })

    if (p2wpkh.address) this.addresses[index] = p2wpkh.address

    return p2wpkh.address
  }

  findKeyPairByAddress (address: string) {
    info('PeachWallet - findKeyPairByAddress - start')

    const limit = this.addresses.length + this.gapLimit
    for (let i = 0; i <= limit; i++) {
      info('PeachWallet - findKeyPairByAddress - scanning', i)

      const candidate = this._getAddress(i)
      if (address === candidate) {
        useWalletState.getState().setAddresses(this.addresses)
        return this.getKeyPair(i)
      }
    }

    useWalletState.getState().setAddresses(this.addresses)
    return null
  }

  _getNetwork (): Network {
    if (this.network === 'testnet') return networks.testnet
    if (this.network === 'regtest') return networks.regtest
    return networks.bitcoin
  }

  signMessage (message: string, address: string, index?: number) {
    info('PeachWallet - signMessage - start')

    const keyPair = index !== undefined ? this.getKeyPair(index) : this.findKeyPairByAddress(address)
    if (!keyPair?.privateKey) throw Error('Address not part of wallet')
    const signature = sign(message, keyPair.privateKey, true)

    info('PeachWallet - signMessage - end')

    return signature.toString('base64')
  }
}
