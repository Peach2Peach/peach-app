import { offerIdToHex } from '../offer'

/**
 * @description Method to convert contract id to hex
 * @param contractId contract id
 * @returns hex representation of contract id
 */
export const contractIdToHex = (contractId: Contract['id']) => {
  const sellOfferId = offerIdToHex(contractId.split('-')[0]).replace('P', '')
  const buyOfferId = offerIdToHex(contractId.split('-')[1]).replace('P', '')
  return `PC-${sellOfferId}-${buyOfferId}`
}