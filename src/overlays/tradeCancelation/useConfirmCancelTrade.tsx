import { useCallback } from 'react'
import { useOverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useShowLoadingOverlay } from '../../hooks/useShowLoadingOverlay'
import { account } from '../../utils/account'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { saveOffer } from '../../utils/offer'
import { ConfirmCancelTrade } from './ConfirmCancelTrade'
import { cancelContractAsBuyer } from './helpers/cancelContractAsBuyer'
import { cancelContractAsSeller } from './helpers/cancelContractAsSeller'

export const useConfirmCancelTrade = () => {
  const [, updateOverlay] = useOverlayContext()
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])
  const showLoadingOverlay = useShowLoadingOverlay()

  const cancelBuyer = useCallback(
    async (contract: Contract) => {
      showLoadingOverlay({
        title: i18n('contract.cancel.title'),
        level: 'ERROR',
      })
      const result = await cancelContractAsBuyer(contract)

      if (result.isError() || !result.isOk()) {
        closeOverlay()
        showError(result.isError() ? result.getError() : undefined)
        return
      }
      saveContract(result.getValue().contract)
      navigation.replace('contract', { contractId: contract.id })
      updateOverlay({ title: i18n('contract.cancel.success'), visible: true, level: 'APP' })
    },
    [closeOverlay, navigation, showError, showLoadingOverlay, updateOverlay],
  )

  const cancelSeller = useCallback(
    async (contract: Contract) => {
      showLoadingOverlay({
        title: i18n('contract.cancel.title'),
        level: 'ERROR',
      })
      const result = await cancelContractAsSeller(contract)

      if (result.isError() || !result.isOk()) {
        showError(result.isError() ? result.getError() : undefined)
        closeOverlay()
        return
      }

      const { contract: contractUpdate, sellOffer } = result.getValue()
      saveContract(contractUpdate)
      if (sellOffer) saveOffer(sellOffer)
      navigation.replace('contract', { contractId: contract.id })
      closeOverlay()
    },
    [showLoadingOverlay, navigation, closeOverlay, showError],
  )

  const showConfirmOverlay = useCallback(
    (contract: Contract) => {
      const view = account.publicKey === contract?.seller.id ? 'seller' : 'buyer'
      const cancelAction = () => (view === 'seller' ? cancelSeller(contract) : cancelBuyer(contract))
      updateOverlay({
        title: i18n('contract.cancel.title'),
        level: 'ERROR',
        content: <ConfirmCancelTrade {...{ contract, view }} />,
        visible: true,
        action1: {
          label: i18n('contract.cancel.title'),
          icon: 'xCircle',
          callback: cancelAction,
        },
        action2: {
          label: i18n('contract.cancel.confirm.back'),
          icon: 'arrowLeftCircle',
          callback: closeOverlay,
        },
      })

      return {
        cancelAction,
      }
    },
    [updateOverlay, cancelSeller, cancelBuyer, closeOverlay],
  )

  return { showConfirmOverlay, cancelSeller, cancelBuyer, showLoadingOverlay, closeOverlay }
}
