import { error, info } from '../../../utils/log'
import DifferentCurrencyWarning from '../../../overlays/DifferentCurrencyWarning'
import React, { useContext } from 'react'
import { MessageContext } from '../../../contexts/message'
import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { useNavigation, useRoute } from '../../../hooks'
import { OverlayContext } from '../../../contexts/overlay'

import { useMatchStore } from '../store'
import shallow from 'zustand/shallow'
import { updateMatchedStatus, matchFn, handleMissingPaymentData, handleRefundTx } from '../utils'

export const useMatchOffer = (offer: BuyOffer | SellOffer, match: Match) => {
  const matchingOfferId = match.offerId
  const queryClient = useQueryClient()
  const navigation = useNavigation()
  const routeParams = useRoute<'search'>().params
  const [, updateMessage] = useContext(MessageContext)
  const [, updateOverlay] = useContext(OverlayContext)

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
      if (!offer.meansOfPayment[selectedCurrency]?.includes(selectedPaymentMethod)) {
        updateOverlay({
          content: <DifferentCurrencyWarning currency={selectedCurrency} paymentMethod={selectedPaymentMethod} />,
          showCloseButton: false,
          showCloseIcon: false,
        })
      }

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
      const contractId = await handleRefundTx(offer, result)
      if (contractId) {
        info('Search.tsx - _match', `navigate to contract ${contractId}`)
        navigation.replace('contract', { contractId })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['matches', offer.id])
    },
  })
}
