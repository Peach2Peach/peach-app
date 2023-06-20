import { NETWORK } from '@env'
import { Network } from 'bdk-rn/lib/lib/enums'
import { BIP32Interface } from 'bip32'
import { payments } from 'bitcoinjs-lib'
import { sign } from 'bitcoinjs-message'
import { info } from '../log'
import { getNetwork } from './getNetwork'
import { useWalletState } from './walletStore'

type PeachJSWalletProps = {
  wallet: BIP32Interface
  network?: BitcoinNetwork
  gapLimit?: number
}
export class PeachJSWallet {
  jsWallet: BIP32Interface

  network: Network

  derivationPath: string

  gapLimit: number

  addresses: string[]

  constructor ({ wallet, network = NETWORK, gapLimit = 25 }: PeachJSWalletProps) {
    this.jsWallet = wallet

    this.network = network as Network
    this.gapLimit = gapLimit
    this.addresses = useWalletState.getState().addresses

    this.derivationPath = `m/84'/${network === 'bitcoin' ? '0' : '1'}'/0'`
  }

  getKeyPair (index: number): BIP32Interface {
    return this.jsWallet.derivePath(`${this.derivationPath}/0/${index}`)
  }

  getAddress (index: number): string | undefined {
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

  findKeyPairByAddress (address: string): BIP32Interface | null {
    info('PeachWallet - findKeyPairByAddress - start')

    const limit = this.addresses.length + this.gapLimit
    for (let i = 0; i <= limit; i++) {
      info('PeachWallet - findKeyPairByAddress - scanning', i)

      const candidate = this.getAddress(i)
      if (address === candidate) {
        useWalletState.getState().setAddresses(this.addresses)
        return this.getKeyPair(i)
      }
    }

    useWalletState.getState().setAddresses(this.addresses)
    return null
  }

  signMessage (message: string, address: string, index?: number): string {
    info('PeachWallet - signMessage - start')

    const keyPair = index !== undefined ? this.getKeyPair(index) : this.findKeyPairByAddress(address)
    if (!keyPair?.privateKey) throw Error('Address not part of wallet')
    const signature = sign(message, keyPair.privateKey, true)

    info('PeachWallet - signMessage - end')

    return signature.toString('base64')
  }
}
