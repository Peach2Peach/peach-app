import { Psbt } from 'bitcoinjs-lib'
import { reverseBuffer } from '../crypto'

export const txIdPartOfPSBT = (txId: string, psbt: Psbt) =>
  psbt.txInputs.some((input) => txId === reverseBuffer(input.hash).toString('hex'))
