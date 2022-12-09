import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { MessageContext } from '../../../contexts/message'
import { useNavigation, useRoute } from '../../../hooks'
import { error, info } from '../../../utils/log'

import shallow from 'zustand/shallow'
import { useMatchStore } from '../store'
import { handleMissingPaymentData, createRefundTx, matchFn, updateMatchedStatus } from '../utils'
import { isSellOffer, saveOffer } from '../../../utils/offer'

export const useMatchOffer = (offer: BuyOffer | SellOffer, match: Match) => {
  const matchingOfferId = match.offerId
  const queryClient = useQueryClient()
  const navigation = useNavigation()
  const routeParams = useRoute<'search'>().params
  const [, updateMessage] = useContext(MessageContext)

  const { selectedCurrency, selectedPaymentMethod, currentPage } = useMatchStore(
    (state) => ({
      selectedCurrency: state.selectedCurrency,
      selectedPaymentMethod: state.selectedPaymentMethod,
      currentPage: state.currentPage,
    }),
    shallow,
  )

  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries(['matches', offer.id])
      const previousData = queryClient.getQueryData<GetMatchesResponse>(['matches', offer.id])
      queryClient.setQueryData(['matches', offer.id], (oldQueryData: InfiniteData<GetMatchesResponse> | undefined) =>
        updateMatchedStatus(true, oldQueryData, matchingOfferId, offer, currentPage),
      )

      return { previousData }
    },
    mutationFn: () => matchFn(match, offer, selectedCurrency, selectedPaymentMethod, updateMessage),
    onError: (err: 'Missing values' | 'Missing paymentdata' | string | undefined, _variables, context) => {
      if (err === 'Missing values') {
        error(
          'Match data missing values.',
          `selectedCurrency: ${selectedCurrency}`,
          `selectedPaymentMethod: ${selectedPaymentMethod}`,
        )
      } else if (err === 'Missing paymentdata') {
        handleMissingPaymentData(offer, selectedCurrency, selectedPaymentMethod, updateMessage, navigation, routeParams)
      } else if (typeof err === 'string') {
        error(err)
      }
      queryClient.setQueryData(['matches', offer.id], context?.previousData)
    },
    onSuccess: async (result: MatchResponse) => {
      const refundTx = isSellOffer(offer) && result.refundTx ? await createRefundTx(offer, result.refundTx) : undefined
      if (isSellOffer(offer)) {
        saveOffer({
          ...(offer as SellOffer),
          doubleMatched: true,
          contractId: result.contractId,
          refundTx,
        })
      }
      if (result.contractId) {
        info('Search.tsx - _match', `navigate to contract ${result.contractId}`)
        navigation.replace('contract', { contractId: result.contractId })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['matches', offer.id])
    },
  })
}
