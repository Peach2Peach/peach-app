import { useCallback, useContext } from 'react'
import { OverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import { useContractStore } from '../../store/contractStore'
import i18n from '../../utils/i18n'
import { BuyerRejectedCancelTrade } from './BuyerRejectedCancelTrade'

export const useBuyerRejectedCancelTradeOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const updateContract = useContractStore((state) => state.updateContract)
  const navigation = useNavigation()

  const confirmOverlay = useCallback(
    (contract: Contract) => {
      updateOverlay({ visible: false })
      navigation.replace('contract', { contractId: contract.id })
      updateContract(contract.id, {
        cancelConfirmationDismissed: true,
        cancelConfirmationPending: false,
      })
    },
    [updateOverlay, navigation, updateContract],
  )

  const showCancelTradeRequestRejected = useCallback(
    (contract: Contract) => {
      updateOverlay({
        title: i18n('contract.cancel.buyerRejected.title'),
        content: <BuyerRejectedCancelTrade contract={contract} />,
        visible: true,
        requireUserAction: true,
        level: 'WARN',
        action1: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: () => confirmOverlay(contract),
        },
      })
    },
    [confirmOverlay, updateOverlay],
  )
  return showCancelTradeRequestRejected
}
