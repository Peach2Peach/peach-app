import { useCallback, useContext } from 'react'
import { Loading } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useContractStore } from '../../store/contractStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { confirmContractCancelation, rejectContractCancelation } from '../../utils/peachAPI'
import { ConfirmCancelTradeRequest } from './ConfirmCancelTradeRequest'

export const useConfirmTradeCancelationOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const updateContract = useContractStore((state) => state.updateContract)
  const showError = useShowErrorBanner()
  const navigation = useNavigation()

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])
  const showLoadingOverlay = useCallback(
    () =>
      updateOverlay({
        title: i18n('contract.cancel.sellerWantsToCancel.title'),
        content: <Loading style={tw`self-center`} color={tw`text-black-1`.color} />,
        visible: true,
        level: 'WARN',
        requireUserAction: true,
        action1: {
          label: i18n('loading'),
          icon: 'clock',
          callback: () => {},
        },
      }),
    [updateOverlay],
  )
  const cancelTrade = useCallback(
    async (contract: Contract) => {
      showLoadingOverlay()
      const [result, err] = await confirmContractCancelation({ contractId: contract.id })

      if (result) {
        updateContract(contract.id, {
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
    [closeOverlay, navigation, showError, showLoadingOverlay, updateContract, updateOverlay],
  )

  const continueTrade = useCallback(
    async (contract: Contract) => {
      showLoadingOverlay()
      const [result, err] = await rejectContractCancelation({ contractId: contract.id })

      if (result) {
        updateContract(contract.id, {
          cancelationRequested: false,
        })
        closeOverlay()
        navigation.navigate('contract', { contractId: contract.id })
      } else if (err) {
        showError(err.error)
      }
      closeOverlay()
    },
    [closeOverlay, navigation, showError, showLoadingOverlay, updateContract],
  )

  const showConfirmTradeCancelation = useCallback(
    (contract: Contract) => {
      updateOverlay({
        title: i18n('contract.cancel.sellerWantsToCancel.title'),
        content: <ConfirmCancelTradeRequest contract={contract} />,
        visible: true,
        level: 'WARN',
        action2: {
          label: i18n('contract.cancel.sellerWantsToCancel.cancel'),
          icon: 'xCircle',
          callback: () => cancelTrade(contract),
        },
        action1: {
          label: i18n('contract.cancel.sellerWantsToCancel.continue'),
          icon: 'arrowRightCircle',
          callback: () => continueTrade(contract),
        },
      })
    },
    [cancelTrade, continueTrade, updateOverlay],
  )

  return showConfirmTradeCancelation
}
