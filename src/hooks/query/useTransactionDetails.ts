import { useQuery } from '@tanstack/react-query'
import { getTransactionDetails } from '../../utils/electrum/getTransactionDetails'

const getTransactionDetailsQuery = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, txId] = queryKey
  const [result, err] = await getTransactionDetails({ txId })
  if (err) throw new Error(err.error)
  return result
}

type Props = {
  txId: string
}

export const useTransactionDetails = ({ txId }: Props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactionDetails', txId],
    queryFn: getTransactionDetailsQuery,
  })
  return { transaction: data, isLoading, error }
}
