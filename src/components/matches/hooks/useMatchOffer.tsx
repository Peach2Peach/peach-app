import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { MessageContext } from '../../../contexts/message'
import { useNavigation } from '../../../hooks'
import { error, info } from '../../../utils/log'

import shallow from 'zustand/shallow'
import { isSellOffer, saveOffer } from '../../../utils/offer'
import { parseError } from '../../../utils/system'
import { useMatchStore } from '../store'
import { createRefundTx, handleError, handleMissingPaymentData, matchFn, updateMatchedStatus } from '../utils'
import { useShowAppPopup } from '../../../hooks/useShowAppPopup'

export const useMatchOffer = (offer: BuyOffer | SellOffer, match: Match) => {
  const matchingOfferId = match.offerId
  const queryClient = useQueryClient()
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)

  const showPopup = useShowAppPopup('offerTaken')

  const { selectedCurrency, selectedPaymentMethod, currentPage } = useMatchStore(
    (state) => ({
      selectedCurrency: state.matchSelectors[match.offerId]?.selectedCurrency,
      selectedPaymentMethod: state.matchSelectors[match.offerId]?.selectedPaymentMethod,
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
    onError: (err: Error, _variables, context) => {
      const errorMsg = parseError(err)

      if (errorMsg === 'MISSING_PAYMENTDATA') {
        handleMissingPaymentData(offer, selectedCurrency!, selectedPaymentMethod!, updateMessage, navigation)
      } else if (errorMsg === 'OFFER_TAKEN') {
        showPopup()
      } else {
        if (errorMsg === 'MISSING_VALUES') error(
          'Match data missing values.',
          `selectedCurrency: ${selectedCurrency}`,
          `selectedPaymentMethod: ${selectedPaymentMethod}`,
        )
        handleError({ error: errorMsg }, updateMessage)
      }
      queryClient.setQueryData(['matches', offer.id], context?.previousData)
    },
    onSuccess: async (result: MatchResponse) => {
      if (isSellOffer(offer) && result.refundTx) {
        const refundTx = await createRefundTx(offer, result.refundTx)
        saveOffer({
          ...offer,
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
