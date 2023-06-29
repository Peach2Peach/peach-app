import { NETWORK } from '@env'
import { useMemo } from 'react'
import { useNavigation } from '../../../hooks'
import { useTransactionDetails } from '../../../hooks/query/useTransactionDetails'
import { getReceivingAddress, showTransaction } from '../../../utils/bitcoin'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { canBumpNetworkFees } from '../helpers/canBumpNetworkFees'
import { isRBFEnabled } from '../../../utils/bitcoin/isRBFEnabled'

type Props = {
  transaction: TransactionSummary
}
export const useTransactionDetailsInfoSetup = ({ transaction }: Props) => {
  const navigation = useNavigation()
  const { transaction: transactionDetails } = useTransactionDetails({ txId: transaction.id })
  const receivingAddress = getReceivingAddress(transactionDetails)
  const rbfEnabled = transactionDetails && isRBFEnabled(transactionDetails)
  const canBumpFees = useMemo(
    () => rbfEnabled && canBumpNetworkFees(peachWallet, transaction),
    [rbfEnabled, transaction],
  )
  const goToBumpNetworkFees = () => navigation.navigate('bumpNetworkFees', { txId: transaction.id })
  const openInExplorer = () => showTransaction(transaction.id as string, NETWORK)

  return {
    receivingAddress,
    canBumpFees,
    goToBumpNetworkFees,
    openInExplorer,
  }
}
