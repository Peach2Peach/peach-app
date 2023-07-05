import { getHighestValueOutputAddress } from '../../../utils/bitcoin'

const incomingTypes = ['REFUND', 'TRADE', 'DEPOSIT']
export const getTransactionDestinationAddress = (type: TransactionType, transactionDetails: Transaction) => {
  let address

  if (type === 'ESCROWFUNDED') {
    address = transactionDetails.vout.find(
      ({ scriptpubkey_type }) => scriptpubkey_type === 'v0_p2wsh',
    )?.scriptpubkey_address
  } else if (incomingTypes.includes(type)) {
    address = transactionDetails.vout.find(
      ({ scriptpubkey_type }) => scriptpubkey_type === 'v0_p2wpkh',
    )?.scriptpubkey_address
  }
  return address || getHighestValueOutputAddress(transactionDetails)
}
