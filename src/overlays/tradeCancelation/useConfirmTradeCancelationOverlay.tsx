import { useCallback } from 'react'
import { useOverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useShowLoadingPopup } from '../../hooks/useShowLoadingPopup'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { confirmContractCancelation, rejectContractCancelation } from '../../utils/peachAPI'
import { ConfirmCancelTradeRequest } from './ConfirmCancelTradeRequest'

export const useConfirmTradeCancelationOverlay = () => {
  const [, updateOverlay] = useOverlayContext()
  const showError = useShowErrorBanner()
  const navigation = useNavigation()

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])
  const showLoadingPopup = useShowLoadingPopup()

  const cancelTrade = useCallback(
    async (contract: Contract) => {
      showLoadingPopup({
        title: i18n('contract.cancel.sellerWantsToCancel.title'),
        level: 'DEFAULT',
      })
      const [result, err] = await confirmContractCancelation({ contractId: contract.id })

      if (result) {
        const updatedContract = {
          ...contract,
          canceled: true,
          cancelationRequested: false,
        }
        saveContract(updatedContract)
        updateOverlay({ title: i18n('contract.cancel.success'), visible: true, level: 'DEFAULT' })
        navigation.replace('contract', { contractId: contract.id, contract: updatedContract })
        return
      } else if (err) {
        showError(err.error)
      }
      closeOverlay()
    },
    [closeOverlay, navigation, showError, showLoadingPopup, updateOverlay],
  )

  const continueTrade = useCallback(
    async (contract: Contract) => {
      showLoadingPopup({
        title: i18n('contract.cancel.sellerWantsToCancel.title'),
        level: 'DEFAULT',
      })
      const [result, err] = await rejectContractCancelation({ contractId: contract.id })

      if (result) {
        const updatedContract = {
          ...contract,
          cancelationRequested: false,
        }
        saveContract(updatedContract)
        closeOverlay()
        navigation.replace('contract', { contractId: contract.id, contract: updatedContract })
      } else if (err) {
        showError(err.error)
      }
      closeOverlay()
    },
    [closeOverlay, navigation, showError, showLoadingPopup],
  )

  const showConfirmTradeCancelation = useCallback(
    (contract: Contract) => {
      const cancelTradeCallback = () => cancelTrade(contract)
      const continueTradeCallback = () => continueTrade(contract)
      updateOverlay({
        title: i18n('contract.cancel.sellerWantsToCancel.title'),
        content: <ConfirmCancelTradeRequest contract={contract} />,
        visible: true,
        level: 'DEFAULT',
        action2: {
          label: i18n('contract.cancel.sellerWantsToCancel.cancel'),
          icon: 'xCircle',
          callback: cancelTradeCallback,
        },
        action1: {
          label: i18n('contract.cancel.sellerWantsToCancel.continue'),
          icon: 'arrowRightCircle',
          callback: continueTradeCallback,
        },
      })

      return { cancelTradeCallback, continueTradeCallback }
    },
    [cancelTrade, continueTrade, updateOverlay],
  )

  return { showConfirmTradeCancelation, cancelTrade, continueTrade }
}
