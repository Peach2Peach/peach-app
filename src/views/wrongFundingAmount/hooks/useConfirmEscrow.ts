import { useCallback } from 'react'
import { useNavigation } from '../../../hooks'
import { confirmEscrow } from '../../../utils/peachAPI'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'

export const useConfirmEscrow = () => {
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const confirm = useCallback(
    async (sellOffer: SellOffer) => {
      const [confirmEscrowResult, confirmEscrowErr] = await confirmEscrow({ offerId: sellOffer.id })

      if (!confirmEscrowResult || confirmEscrowErr) {
        showErrorBanner(confirmEscrowErr?.error)
        return
      }
      const destination = sellOffer.funding.status === 'FUNDED' ? 'search' : 'fundEscrow'
      navigation.reset({
        index: 1,
        routes: [{ name: 'yourTrades' }, { name: destination, params: { offerId: sellOffer.id } }],
      })
    },
    [navigation, showErrorBanner],
  )
  return confirm
}
