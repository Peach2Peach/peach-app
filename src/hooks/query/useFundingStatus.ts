import { useQuery } from '@tanstack/react-query'
import { error } from '../../utils/log'
import { defaultFundingStatus } from '../../utils/offer/constants'
import { peachAPI } from '../../utils/peachAPI'

const TWENTYSECONDS = 20 * 1000

const getFundingStatusQuery = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, offerId] = queryKey

  const { result: fundingStatus, error: err } = await peachAPI.private.offer.getFundingStatus({ offerId })
  if (!fundingStatus || err) {
    error('Could not fetch funding status for offer', offerId, err?.error)
    throw new Error(err?.error)
  }
  return fundingStatus
}

export const useFundingStatus = (id: string, enabled = true) => {
  const {
    data,
    isLoading,
    error: fundingStatusError,
  } = useQuery({
    queryKey: ['fundingStatus', id],
    queryFn: getFundingStatusQuery,
    enabled,
    refetchInterval: TWENTYSECONDS,
  })

  const fundingStatus = data?.funding || defaultFundingStatus
  const userConfirmationRequired = data?.userConfirmationRequired || false

  return {
    fundingStatus,
    userConfirmationRequired,
    isLoading,
    error: fundingStatusError,
  }
}
