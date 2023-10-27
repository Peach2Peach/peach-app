import { useQueryClient } from '@tanstack/react-query'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { TradeBreakdownPopup } from '../../../popups/TradeBreakdownPopup'
import { useSettingsStore } from '../../../store/settingsStore'
import { usePopupStore } from '../../../store/usePopupStore'
import { createUserRating } from '../../../utils/contract'
import { rateUser } from '../../../utils/peachAPI'

type Props = {
  contract: Contract
  view: ContractViewer
  vote: 'positive' | 'negative' | undefined
}
export const useRateSetup = ({ contract, view, vote }: Props) => {
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const setPopup = usePopupStore((state) => state.setPopup)
  const showError = useShowErrorBanner()
  const [shouldShowBackupOverlay, setShowBackupReminder, isPeachWalletActive] = useSettingsStore(
    (state) => [state.shouldShowBackupOverlay, state.setShowBackupReminder, state.peachWalletActive],
    shallow,
  )

  const navigateAfterRating = (rating: 1 | -1) => {
    if (shouldShowBackupOverlay && isPeachWalletActive && view === 'buyer') {
      setShowBackupReminder(true)
      return navigation.replace(
        'backupTime',
        rating === 1 ? { nextScreen: 'contract', contractId: contract.id } : { nextScreen: 'yourTrades' },
      )
    } else if (rating === 1) {
      return navigation.replace('contract', { contractId: contract.id })
    }
    return navigation.replace('yourTrades')
  }

  const rate = async () => {
    if (!vote) return

    const { rating, signature } = createUserRating(
      view === 'seller' ? contract.buyer.id : contract.seller.id,
      vote === 'positive' ? 1 : -1,
    )

    const [, err] = await rateUser({
      contractId: contract.id,
      rating,
      signature,
    })

    if (err) {
      showError(err.error)
      return
    }
    await queryClient.invalidateQueries(['contract', contract.id])
    await queryClient.invalidateQueries(['contractSummaries'])
    navigateAfterRating(rating)
  }

  const showTradeBreakdown = () => setPopup(<TradeBreakdownPopup contract={contract} />)

  return { rate, showTradeBreakdown }
}
