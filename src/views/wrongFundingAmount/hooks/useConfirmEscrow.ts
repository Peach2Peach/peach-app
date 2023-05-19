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
      if (sellOffer.funding.status === 'FUNDED') {
        navigation.replace('search', { offerId: sellOffer.id })
      } else {
        navigation.replace('fundEscrow', { offerId: sellOffer.id })
      }
    },
    [navigation, showErrorBanner],
  )
  return confirm
}
