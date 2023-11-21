import { BlockTime, TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { useMemo } from 'react'
import { useRoute } from '../../../hooks'
import { useTransactionDetails } from '../../../hooks/query/useTransactionDetails'
import { useAreMyAddresses } from '../../../hooks/wallet/useIsMyAddress'
import { sum } from '../../../utils/math'
import { isDefined } from '../../../utils/validation'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { getTxSummary } from '../helpers/getTxSummary'
import { useSyncWallet } from './useSyncWallet'

const useMapTransactionToTx = (transaction?: Transaction | null) => {
  const areMyReceivingAddresses = useAreMyAddresses(transaction?.vout.map((vout) => vout.scriptpubkey_address) || [])
  const areMySendingAddresses = useAreMyAddresses(
    transaction?.vin
      .map((vout) => vout.prevout)
      .filter(isDefined)
      .filter((prevout) => prevout)
      .map((prevout) => prevout.scriptpubkey_address) || [],
  )
  if (!transaction) return undefined

  const receivingOutputs = areMyReceivingAddresses
    .map((isMine, index) => (isMine ? transaction.vout[index] : undefined))
    .filter(isDefined)
  const sendingOutputs = areMySendingAddresses
    .map((isMine, index) => (isMine ? transaction.vin[index] : undefined))
    .filter(isDefined)
  const received = receivingOutputs.map((vout) => vout?.value).reduce(sum, 0)
  const sent = sendingOutputs
    .map((vout) => vout.prevout)
    .filter(isDefined)
    .filter((prevout) => prevout)
    .map((prevout) => prevout.value)
    .reduce(sum, 0)
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
  const localTx = useWalletState((state) => state.getTransaction(txId))
  const { transaction: transactionDetails } = useTransactionDetails({ txId })
  const mappedTx = useMapTransactionToTx(transactionDetails)
  const tx = localTx || mappedTx
  const transaction = useMemo(() => (tx ? getTxSummary(tx) : undefined), [tx])
  const { refresh, isRefreshing } = useSyncWallet()

  return { transaction, refresh, isRefreshing }
}
