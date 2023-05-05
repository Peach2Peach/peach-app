import { BIP32Interface } from 'bip32'
import { Psbt } from 'bitcoinjs-lib'

export const signPSBT = (psbt: Psbt, wallet: BIP32Interface): Psbt => {
  psbt.txInputs.forEach((input, i) => {
    psbt.signInput(i, wallet)
  })

  return psbt
}
