import { useQueryClient, useMutation, InfiniteData } from '@tanstack/react-query'
import { useContext } from 'react'
import { MessageContext } from '../../../contexts/message'
import { error } from '../../../utils/log'
import { unmatchOffer } from '../../../utils/peachAPI'
import { updateMatchedStatus } from '../../../views/search/match'
import { useMatchStore } from '../store'

export const useUnmatchOffer = (offer: BuyOffer | SellOffer, matchingOfferId: string) => {
  const queryClient = useQueryClient()
  const [, updateMessage] = useContext(MessageContext)
  const currentPage = useMatchStore((state) => state.currentPage)

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['matches', offer.id])
      const previousData = queryClient.getQueryData<GetMatchesResponse>(['matches', offer.id])
      queryClient.setQueryData(['matches', offer.id], (oldQueryData: InfiniteData<GetMatchesResponse> | undefined) =>
        updateMatchedStatus(false, oldQueryData, matchingOfferId, offer, currentPage),
      )
      return { previousData }
    },
    mutationFn: () =>
      !!offer?.id
        ? unmatchOffer({ offerId: offer.id, matchingOfferId })
        : Promise.reject(new Error('Offer Id not present')),
    onError: (_error: { error: string }, _hero, context) => {
      queryClient.setQueryData(['matches', offer.id], context?.previousData)

      error('Error', _error)
      updateMessage({
        msgKey: _error?.error || 'error.general',
        level: 'ERROR',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries(['matches', offer.id])
    },
  })
}
