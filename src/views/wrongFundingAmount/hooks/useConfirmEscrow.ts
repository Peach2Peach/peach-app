import { useCallback } from 'react'
import { useNavigation } from '../../../hooks'
import { confirmEscrow } from '../../../utils/peachAPI'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useQueryClient } from '@tanstack/react-query'

export const useConfirmEscrow = () => {
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()
  const queryClient = useQueryClient()

  const confirm = useCallback(
    async (sellOffer: SellOffer) => {
      const [confirmEscrowResult, confirmEscrowErr] = await confirmEscrow({ offerId: sellOffer.id })

      if (!confirmEscrowResult || confirmEscrowErr) {
        showErrorBanner(confirmEscrowErr?.error)
        return
      }
      const destination = sellOffer.funding.status === 'FUNDED' ? 'search' : 'fundEscrow'
      queryClient.setQueryData(
        ['fundingStatus', sellOffer.id],
        (oldQueryData: FundingStatusResponse | undefined) =>
          oldQueryData && {
            ...oldQueryData,
            userConfirmationRequired: false,
          },
      )

      navigation.reset({
        index: 1,
        routes: [{ name: 'yourTrades' }, { name: destination, params: { offerId: sellOffer.id } }],
      })
    },
    [navigation, queryClient, showErrorBanner],
  )
  return confirm
}
