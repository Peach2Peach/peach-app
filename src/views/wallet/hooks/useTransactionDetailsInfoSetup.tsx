import { NETWORK } from '@env'
import { useMemo } from 'react'
import { useNavigation } from '../../../hooks'
import { useTransactionDetails } from '../../../hooks/query/useTransactionDetails'
import { getReceivingAddress, showTransaction } from '../../../utils/bitcoin'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { canBumpNetworkFees } from '../helpers/canBumpNetworkFees'

type Props = {
  transaction: TransactionSummary
}
export const useTransactionDetailsInfoSetup = ({ transaction }: Props) => {
  const navigation = useNavigation()
  const { transaction: transactionDetails } = useTransactionDetails({ txId: transaction.id })
  const receivingAddress = getReceivingAddress(transactionDetails)
  const canBumpFees = useMemo(() => canBumpNetworkFees(peachWallet, transaction), [transaction])
  const goToBumpNetworkFees = () => navigation.navigate('bumpNetworkFees', { txId: transaction.id })
  const openInExplorer = () => showTransaction(transaction.id as string, NETWORK)

  return {
    receivingAddress,
    canBumpFees,
    goToBumpNetworkFees,
    openInExplorer,
  }
}
