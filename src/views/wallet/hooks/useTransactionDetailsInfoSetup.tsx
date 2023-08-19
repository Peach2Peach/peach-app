import { NETWORK } from '@env'
import { useMemo } from 'react'
import { useNavigation } from '../../../hooks'
import { useTransactionDetails } from '../../../hooks/query/useTransactionDetails'
import { showTransaction } from '../../../utils/bitcoin'
import { isRBFEnabled } from '../../../utils/bitcoin/isRBFEnabled'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { canBumpNetworkFees } from '../helpers/canBumpNetworkFees'
import { getTransactionDestinationAddress } from '../helpers/getTransactionDestinationAddress'

type Props = {
  transaction: TransactionSummary
}
export const useTransactionDetailsInfoSetup = ({ transaction }: Props) => {
  const navigation = useNavigation()
  const { transaction: transactionDetails } = useTransactionDetails({ txId: transaction.id })
  const receivingAddress = transactionDetails
    ? getTransactionDestinationAddress(transaction.type, transactionDetails)
    : undefined
  const rbfEnabled = transactionDetails && isRBFEnabled(transactionDetails)
  const canBumpFees = useMemo(
    () => rbfEnabled && canBumpNetworkFees(peachWallet, transaction),
    [rbfEnabled, transaction],
  )
  const goToBumpNetworkFees = () => navigation.navigate('bumpNetworkFees', { txId: transaction.id })
  const openInExplorer = () => showTransaction(transaction.id, NETWORK)

  return {
    receivingAddress,
    canBumpFees,
    goToBumpNetworkFees,
    openInExplorer,
  }
}
