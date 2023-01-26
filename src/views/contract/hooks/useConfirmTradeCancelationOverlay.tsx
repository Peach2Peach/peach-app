import React, { useContext } from 'react'
import { Loading } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { ConfirmCancelTradeRequest } from '../../../overlays/tradeCancelation/ConfirmCancelTradeRequest'
import tw from '../../../styles/tailwind'
import { getOfferIdFromContract, saveContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { confirmContractCancelation, rejectContractCancelation } from '../../../utils/peachAPI'

export const useConfirmTradeCancelationOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const showError = useShowErrorBanner()
  const navigation = useNavigation()

  const closeOverlay = () => updateOverlay({ visible: false })
  const showLoadingOverlay = () =>
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
    })
  const cancelTrade = async (contract: Contract) => {
    showLoadingOverlay()
    const [result, err] = await confirmContractCancelation({ contractId: contract.id })

    if (result) {
      saveContract({
        ...contract,
        canceled: true,
        cancelationRequested: false,
      })
      updateOverlay({ title: i18n('contract.cancel.success'), visible: true, level: 'APP' })
      navigation.replace('offer', { offerId: getOfferIdFromContract(contract) })
    } else if (err) {
      showError(err.error)
    }
    closeOverlay()
  }

  const continueTrade = async (contract: Contract) => {
    showLoadingOverlay()
    const [result, err] = await rejectContractCancelation({ contractId: contract.id })

    if (result) {
      saveContract({
        ...contract,
        cancelationRequested: false,
      })
      closeOverlay()
      navigation.navigate('contract', { contractId: contract.id })
    } else if (err) {
      showError(err.error)
    }
    closeOverlay()
  }

  return (contract: Contract) => {
    updateOverlay({
      title: i18n('contract.cancel.sellerWantsToCancel.title'),
      content: <ConfirmCancelTradeRequest contract={contract} />,
      visible: true,
      level: 'WARN',
      action1: {
        label: i18n('contract.cancel.sellerWantsToCancel.cancel'),
        icon: 'xCircle',
        callback: () => cancelTrade(contract),
      },
      action2: {
        label: i18n('contract.cancel.sellerWantsToCancel.continue'),
        icon: 'arrowLeftCircle',
        callback: () => continueTrade(contract),
      },
    })
  }
}
