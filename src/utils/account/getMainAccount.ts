import { BIP32Interface } from 'bip32'

export const getMainAccount = (wallet: BIP32Interface, network: BitcoinNetwork) =>
  wallet.derivePath(`m/48'/${network === 'bitcoin' ? '0' : '1'}'/0'/0'`)
