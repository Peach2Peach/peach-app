import { BIP32Interface } from 'bip32'
import { Psbt } from 'bitcoinjs-lib'
import { getFinalScript } from '../wallet'

export const signAndFinalizePSBT = (psbt: Psbt, wallet: BIP32Interface): Psbt => {
  psbt.txInputs.forEach((input, i) => {
    psbt.signInput(i, wallet).finalizeInput(i, getFinalScript)
  })

  return psbt
}
