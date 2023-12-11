import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MatchFilter } from '../../../peach-api/src/@types/api/offerAPI'
import { peachAPI } from '../../utils/peachAPI'
import { useShowErrorBanner } from '../useShowErrorBanner'

type NewData = {
  refundAddress?: string
  refundTx?: string
  premium?: number
} & Partial<MatchFilter>

export const usePatchOffer = () => {
  const queryClient = useQueryClient()
  const showErrorBanner = useShowErrorBanner()

  return useMutation({
    onMutate: async ({ offerId, newData }) => {
      await queryClient.cancelQueries({ queryKey: ['offer', offerId] })
      const previousData = queryClient.getQueryData<BuyOffer | SellOffer>(['offer', offerId])
      queryClient.setQueryData(
        ['offer', offerId],
        (oldQueryData: BuyOffer | SellOffer | undefined) => oldQueryData && { ...oldQueryData, ...newData },
      )

      return { previousData }
    },
    mutationFn: async ({ offerId, newData }: { offerId: string; newData: NewData }) => {
      const { error } = await peachAPI.private.offer.patchOffer({ offerId, ...newData })
      if (error) throw new Error(error.error)
    },
    onError: (err: Error, { offerId }, context) => {
      queryClient.setQueryData(['offer', offerId || offerId], context?.previousData)
      showErrorBanner(err.message)
    },
    onSettled: (_data, _error, { offerId }) => {
      queryClient.invalidateQueries(['offer', offerId])
    },
  })
}
