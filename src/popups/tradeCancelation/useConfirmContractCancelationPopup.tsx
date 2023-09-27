import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useShowLoadingPopup } from '../../hooks/useShowLoadingPopup'
import { usePopupStore } from '../../store/usePopupStore'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { peachAPI, rejectContractCancelation } from '../../utils/peachAPI'
import { ConfirmCancelTradeRequest } from './ConfirmCancelTradeRequest'

export const useConfirmContractCancelationPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showError = useShowErrorBanner()
  const navigation = useNavigation()
  const showLoadingPopup = useShowLoadingPopup()

  const showLoading = useCallback(() => {
    showLoadingPopup({ title: i18n('contract.cancel.sellerWantsToCancel.title'), level: 'DEFAULT' })
  }, [showLoadingPopup])

  const cancelTrade = useCallback(
    async (contract: Contract) => {
      showLoading()
      const { result, error: err } = await peachAPI.private.contract.confirmContractCancelation({
        contractId: contract.id,
      })

      if (result) {
        const updatedContract = {
          ...contract,
          canceled: true,
          cancelationRequested: false,
        }
        saveContract(updatedContract)
        setPopup({
          title: i18n('contract.cancel.success'),
          visible: true,
          level: 'DEFAULT',
        })
        navigation.replace('contract', { contractId: contract.id, contract: updatedContract })
        return
      } else if (err) {
        showError(err.error)
      }
      closePopup()
    },
    [closePopup, navigation, setPopup, showError, showLoading],
  )

  const continueTrade = useCallback(
    async (contract: Contract) => {
      showLoading()
      const [result, err] = await rejectContractCancelation({ contractId: contract.id })

      if (result) {
        const updatedContract = {
          ...contract,
          cancelationRequested: false,
        }
        saveContract(updatedContract)
        closePopup()
        navigation.replace('contract', { contractId: contract.id, contract: updatedContract })
      } else if (err) {
        showError(err.error)
      }
      closePopup()
    },
    [closePopup, navigation, showError, showLoading],
  )

  const showConfirmContractCancelation = useCallback(
    (contract: Contract) => {
      const cancelTradeCallback = () => cancelTrade(contract)
      const continueTradeCallback = () => continueTrade(contract)
      setPopup({
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
    [cancelTrade, continueTrade, setPopup],
  )

  return { showConfirmContractCancelation }
}
