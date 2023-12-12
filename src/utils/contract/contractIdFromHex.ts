import { offerIdFromHex } from '../offer/offerIdFromHex'

export const contractIdFromHex = (contractIdHex: string) => {
  const contractId = contractIdHex.replace('PC‑', '')
  const sellOfferId = offerIdFromHex(contractId.split('‑')[0])
  const buyOfferId = offerIdFromHex(contractId.split('‑')[1])
  return `${sellOfferId}-${buyOfferId}`
}
