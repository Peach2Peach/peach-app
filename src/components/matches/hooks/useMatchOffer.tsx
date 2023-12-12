import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { shallow } from 'zustand/shallow'
import { GetMatchesResponseBody } from '../../../../peach-api/src/@types/api/offerAPI'
import { useNavigation } from '../../../hooks'
import { useShowAppPopup } from '../../../hooks/useShowAppPopup'
import { error, info } from '../../../utils/log'
import { isSellOffer } from '../../../utils/offer/isSellOffer'
import { saveOffer } from '../../../utils/offer/saveOffer'
import { parseError } from '../../../utils/result/parseError'
import { useMessageState } from '../../message/useMessageState'
import { useMatchStore } from '../store'
import { createRefundTx, handleError, handleMissingPaymentData, matchFn, updateMatchedStatus } from '../utils'

export const useMatchOffer = (offer: BuyOffer | SellOffer, match: Match) => {
  const matchingOfferId = match.offerId
  const queryClient = useQueryClient()
  const navigation = useNavigation()
  const updateMessage = useMessageState((state) => state.updateMessage)

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
      await queryClient.cancelQueries({ queryKey: ['matches', offer.id] })
      const previousData = queryClient.getQueryData<GetMatchesResponseBody>(['matches', offer.id])
      queryClient.setQueryData(['matches', offer.id], (oldQueryData: InfiniteData<GetMatchesResponseBody> | undefined) =>
        updateMatchedStatus(true, oldQueryData, matchingOfferId, offer, currentPage),
      )

      return { previousData }
    },
    mutationFn: () => matchFn(match, offer, selectedCurrency, selectedPaymentMethod, updateMessage),
    onError: (err: Error, _variables, context) => {
      const errorMsg = parseError(err)

      if (errorMsg === 'MISSING_PAYMENTDATA' && selectedPaymentMethod) {
        handleMissingPaymentData(offer, selectedCurrency, selectedPaymentMethod, updateMessage, navigation)
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
      if (isSellOffer(offer) && 'refundTx' in result && result.refundTx) {
        const refundTx = await createRefundTx(offer, result.refundTx)
        saveOffer({
          ...offer,
          doubleMatched: true,
          contractId: result.contractId,
          refundTx,
        })
      }
      if ('contractId' in result && result.contractId) {
        info('Search.tsx - _match', `navigate to contract ${result.contractId}`)
        navigation.replace('contract', { contractId: result.contractId })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', offer.id] })
      queryClient.invalidateQueries({ queryKey: ['offerSummaries'] })
      queryClient.invalidateQueries({ queryKey: ['contractSummaries'] })
    },
  })
}
