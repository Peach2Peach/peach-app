import { BIP32Interface } from 'bip32'
import { storeIdentity } from '../../../utils/account/storeAccount'

export const storeBase58 = (wallet: BIP32Interface, account: Account) => {
  storeIdentity({
    ...account,
    base58: wallet.toBase58(),
  })
}
