import { useQueryClient, useMutation, InfiniteData } from '@tanstack/react-query'
import { useContext } from 'react'
import { MessageContext } from '../../../contexts/message'
import { useNavigation } from '../../../hooks'
import { useMatchStore } from '../store'
import { unmatchFn, updateMatchedStatus } from '../utils'

export const useUnmatchOffer = (offer: BuyOffer | SellOffer, matchingOfferId: string) => {
  const queryClient = useQueryClient()
  const [, updateMessage] = useContext(MessageContext)
  const currentPage = useMatchStore((state) => state.currentPage)
  const navigation = useNavigation()

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['matches', offer.id])
      const previousData = queryClient.getQueryData<GetMatchesResponse>(['matches', offer.id])
      queryClient.setQueryData(['matches', offer.id], (oldQueryData: InfiniteData<GetMatchesResponse> | undefined) =>
        updateMatchedStatus(false, oldQueryData, matchingOfferId, offer, currentPage),
      )
      return { previousData }
    },
    mutationFn: () => unmatchFn(offer?.id, matchingOfferId, updateMessage, navigation),
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(['matches', offer.id], context?.previousData)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['matches', offer.id])
    },
  })
}
