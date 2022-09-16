import { Psbt } from 'bitcoinjs-lib'
import { reverseBuffer } from '../crypto'

/**
 * @description Method to check wether a transaction id occurs in the inputs of a new transaction
 * @param txId transaction id
 * @param psbt partially signed bitcoin transaction
 * @returns true if txId is present in inputs
 */
export const txIdPartOfPSBT = (txId: string, psbt: Psbt) =>
  psbt.txInputs.some(input => txId === reverseBuffer(input.hash).toString('hex'))
