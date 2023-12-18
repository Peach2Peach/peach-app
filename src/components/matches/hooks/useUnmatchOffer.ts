import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { GetMatchesResponseBody } from '../../../../peach-api/src/@types/api/offerAPI'
import { useMessageState } from '../../message/useMessageState'
import { useMatchStore } from '../store'
import { unmatchFn, updateMatchedStatus } from '../utils'

export const useUnmatchOffer = (offer: BuyOffer | SellOffer, matchingOfferId: string) => {
  const queryClient = useQueryClient()
  const updateMessage = useMessageState((state) => state.updateMessage)
  const currentPage = useMatchStore((state) => state.currentPage)

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['matches', offer.id] })
      const previousData = queryClient.getQueryData<GetMatchesResponseBody>(['matches', offer.id])
      queryClient.setQueryData(['matches', offer.id], (oldQueryData: InfiniteData<GetMatchesResponseBody> | undefined) =>
        updateMatchedStatus(false, oldQueryData, matchingOfferId, currentPage),
      )
      return { previousData }
    },
    mutationFn: () => unmatchFn(offer?.id, matchingOfferId, updateMessage),
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(['matches', offer.id], context?.previousData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', offer.id] })
    },
  })
}
