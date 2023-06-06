import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../hooks'
import { usePopupStore } from '../../store/usePopupStore'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { BuyerRejectedCancelTrade } from './BuyerRejectedCancelTrade'

export const useBuyerRejectedCancelTradePopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const navigation = useNavigation()

  const confirmPopup = useCallback(
    (contract: Contract) => {
      closePopup()
      navigation.replace('contract', { contractId: contract.id })
      saveContract({
        ...contract,
        cancelConfirmationDismissed: true,
        cancelConfirmationPending: false,
      })
    },
    [closePopup, navigation],
  )

  const showCancelTradeRequestRejected = useCallback(
    (contract: Contract) => {
      setPopup({
        title: i18n('contract.cancel.buyerRejected.title'),
        content: <BuyerRejectedCancelTrade contract={contract} />,
        visible: true,
        requireUserAction: true,
        level: 'WARN',
        action1: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: () => confirmPopup(contract),
        },
      })
    },
    [confirmPopup, setPopup],
  )
  return showCancelTradeRequestRejected
}
