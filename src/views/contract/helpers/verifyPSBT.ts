import * as bitcoin from 'bitcoinjs-lib'
import { reverseBuffer } from '../../../utils/crypto'

/**
 * @description Method to verify that a psbt is indeed meant for the current contract
 * @param psbt partially signed bitcoin transaction
 * @param sellOffer sell offer
 * @param contract contract
 * @returns error message ids
 */
export const verifyPSBT = (psbt: bitcoin.Psbt, sellOffer: SellOffer, contract: Contract): string[] => {
  const errorMsg = []
  if (sellOffer.funding?.txId !== reverseBuffer(psbt.txInputs[0].hash).toString('hex')) {
    errorMsg.push('invalidInput')
  }
  if (psbt.txOutputs[0].address !== contract.releaseAddress) {
    errorMsg.push('releaseAddressMismatch')
  }
  return errorMsg
}