import { useQuery } from '@tanstack/react-query'
import { peachAPI } from '../../utils/peachAPI'

const ONEMINUTE = 60 * 1000
export const placeholderFees = {
  fastestFee: 1,
  halfHourFee: 1,
  hourFee: 1,
  economyFee: 1,
  minimumFee: 1,
}
const getFeeEstimateQuery = async () => {
  const { result, error: err } = await peachAPI.public.bitcoin.getFeeEstimate()
  if (err) throw new Error(err.error)
  return result
}

export const useFeeEstimate = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['feeEstimate'],
    queryFn: getFeeEstimateQuery,
    refetchInterval: ONEMINUTE,
  })
  const estimatedFees = data || placeholderFees
  return { estimatedFees, isLoading, error }
}
