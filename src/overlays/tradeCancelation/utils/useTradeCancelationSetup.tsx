import { useCallback, useContext } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { saveContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { confirmContractCancelation, rejectContractCancelation } from '../../../utils/peachAPI'
import { useShowLoadingOverlay } from '../../utils/useShowLoadingOverlay'

export const useCancelTradeSetup = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const showError = useShowErrorBanner()
  const navigation = useNavigation()
  const showLoadingOverlay = useShowLoadingOverlay()

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])

  const cancelTrade = useCallback(
    async (contract: Contract) => {
      showLoadingOverlay(i18n('contract.cancel.sellerWantsToCancel.title'))
      const [result, err] = await confirmContractCancelation({ contractId: contract.id })

      if (result) {
        saveContract({
          ...contract,
          canceled: true,
          cancelationRequested: false,
        })
        updateOverlay({ title: i18n('contract.cancel.success'), visible: true, level: 'APP' })
        navigation.replace('contract', { contractId: contract.id, contract })
      } else if (err) {
        showError(err.error)
      }
      closeOverlay()
    },
    [closeOverlay, navigation, showError, showLoadingOverlay, updateOverlay],
  )

  const continueTrade = useCallback(
    async (contract: Contract) => {
      showLoadingOverlay(i18n('contract.cancel.sellerWantsToCancel.title'))
      const [result, err] = await rejectContractCancelation({ contractId: contract.id })

      if (result) {
        const updatedContract = {
          ...contract,
          cancelationRequested: false,
        }
        saveContract(updatedContract)
        navigation.replace('contract', { contractId: contract.id, contract: updatedContract })
      } else if (err) {
        showError(err.error)
      }
      closeOverlay()
    },
    [closeOverlay, navigation, showError, showLoadingOverlay],
  )
  return { continueTrade, cancelTrade }
}
