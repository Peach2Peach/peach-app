import { BlockTime, TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { useMemo } from 'react'
import { useHeaderSetup, useRoute } from '../../../hooks'
import { useTransactionDetails } from '../../../hooks/query/useTransactionDetails'
import { useAreMyAddresses } from '../../../hooks/wallet/useIsMyAddress'
import i18n from '../../../utils/i18n'
import { sum } from '../../../utils/math'
import { isDefined } from '../../../utils/validation'
import { getTxSummary } from '../helpers/getTxSummary'
import { useSyncWallet } from './useSyncWallet'

const useMapTransactionToTx = (transaction?: Transaction | null) => {
  const areMyAddresses = useAreMyAddresses(transaction?.vout.map((vout) => vout.scriptpubkey_address) || [])
  if (!transaction) return undefined

  const receivingOutputs = areMyAddresses
    .map((isMine, index) => (isMine ? transaction.vout[index] : undefined))
    .filter(isDefined)
  const received = receivingOutputs.map((vout) => vout?.value).reduce(sum, 0)
  const sent = transaction.vin.map((vin) => vin.prevout.value).reduce(sum, 0)
  return new TransactionDetails(
    transaction.txid,
    received,
    sent,
    transaction.fee,
    new BlockTime(transaction.status.block_height, transaction.status.block_time),
    null,
  )
}

export const useTransactionDetailsSetup = () => {
  const { txId } = useRoute<'transactionDetails'>().params
  const { transaction: transactionDetails } = useTransactionDetails({ txId })
  const tx = useMapTransactionToTx(transactionDetails)
  const transaction = useMemo(() => (tx ? getTxSummary(tx) : undefined), [tx])
  const { refresh, isRefreshing } = useSyncWallet()

  useHeaderSetup(i18n('wallet.transactionDetails'))

  return {
    transaction,
    refresh,
    isRefreshing,
  }
}
