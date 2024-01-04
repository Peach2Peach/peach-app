import { NETWORK } from '@env'
import { useMemo } from 'react'
import { useTransactionDetails } from '../../../hooks/query/useTransactionDetails'
import { useNavigation } from '../../../hooks/useNavigation'
import { isRBFEnabled } from '../../../utils/bitcoin/isRBFEnabled'
import { showTransaction } from '../../../utils/bitcoin/showTransaction'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { canBumpNetworkFees } from '../helpers/canBumpNetworkFees'
import { useGetTransactionDestinationAddress } from '../helpers/useGetTransactionDestinationAddress'

const incomingTxType: TransactionType[] = ['DEPOSIT', 'REFUND', 'TRADE']

type Props = {
  transaction: TransactionSummary
}
export const useTransactionDetailsInfoSetup = ({ transaction }: Props) => {
  const navigation = useNavigation()
  const { transaction: transactionDetails } = useTransactionDetails({ txId: transaction.id })
  const receivingAddress = useGetTransactionDestinationAddress({
    vout: transactionDetails?.vout || [],
    incoming: incomingTxType.includes(transaction.type),
  })
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
