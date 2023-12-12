import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peachAPI } from '../../utils/peachAPI'
import { useShowErrorBanner } from '../useShowErrorBanner'

type NewData = {
  refundAddress?: string
  refundTx?: string
  premium?: number
} & Partial<MatchFilter>

export const usePatchOffer = (offerId: string, newData: NewData) => {
  const queryClient = useQueryClient()
  const showErrorBanner = useShowErrorBanner()

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['offer', offerId] })
      const previousData = queryClient.getQueryData<BuyOffer | SellOffer>(['offer', offerId])
      queryClient.setQueryData(
        ['offer', offerId],
        (oldQueryData: BuyOffer | SellOffer | undefined) => oldQueryData && { ...oldQueryData, ...newData },
      )

      return { previousData }
    },
    mutationFn: async () => {
      const { error } = await peachAPI.private.offer.patchOffer({ offerId, ...newData })
      if (error) throw new Error(error.error)
    },
    onError: (err: Error, _variables, context) => {
      queryClient.setQueryData(['offer', offerId], context?.previousData)
      showErrorBanner(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['offer', offerId])
    },
  })
}
