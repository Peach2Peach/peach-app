import { NETWORK } from '@env'
import { shallow } from 'zustand/shallow'
import { useOverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { TradeBreakdown } from '../../../overlays/TradeBreakdown'
import { useSettingsStore } from '../../../store/settingsStore'
import { showAddress, showTransaction } from '../../../utils/bitcoin'
import { createUserRating } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { rateUser } from '../../../utils/peachAPI'

export type Props = {
  contract: Contract
  view: ContractViewer
  vote: 'positive' | 'negative' | undefined
  saveAndUpdate: (contract: Contract) => void
}
export const useRateSetup = ({ contract, view, vote, saveAndUpdate }: Props) => {
  const navigation = useNavigation()
  const [, updateOverlay] = useOverlayContext()
  const showError = useShowErrorBanner()
  const [showBackupReminder, isPeachWalletActive] = useSettingsStore(
    (state) => [state.showBackupReminder, state.peachWalletActive],
    shallow,
  )

  const navigateAfterRating = (rating: 1 | -1) => {
    if (showBackupReminder && !isPeachWalletActive && view === 'buyer') {
      if (rating === 1) {
        return navigation.replace('backupTime', { view, nextScreen: 'contract', contractId: contract.id })
      }
      return navigation.replace('backupTime', { view, nextScreen: 'yourTrades' })
    } else if (rating === 1) {
      return navigation.replace('contract', { contractId: contract.id })
    }
    return navigation.replace('yourTrades')
  }

  const rate = async () => {
    if (!vote) return

    const rating = createUserRating(
      view === 'seller' ? contract.buyer.id : contract.seller.id,
      vote === 'positive' ? 1 : -1,
    )
    const ratedUser = view === 'seller' ? 'ratingBuyer' : 'ratingSeller'

    const [, err] = await rateUser({
      contractId: contract.id,
      rating: rating.rating,
      signature: rating.signature,
    })

    if (err) {
      showError(err.error)
      return
    }
    saveAndUpdate({
      ...contract,
      [ratedUser]: rating.rating,
    })

    navigateAfterRating(rating.rating)
  }
  const viewInExplorer = () =>
    contract.releaseTxId ? showTransaction(contract.releaseTxId, NETWORK) : showAddress(contract.escrow, NETWORK)

  const showTradeBreakdown = () => {
    updateOverlay({
      title: i18n('tradeComplete.popup.tradeBreakdown.title'),
      content: <TradeBreakdown {...contract} />,
      visible: true,
      level: 'APP',
      action2: {
        label: i18n('tradeComplete.popup.tradeBreakdown.explorer'),
        callback: viewInExplorer,
        icon: 'externalLink',
      },
    })
  }

  return { rate, showTradeBreakdown, viewInExplorer }
}
