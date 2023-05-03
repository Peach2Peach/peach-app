import { useCallback } from 'react'
import { useOverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { account } from '../../utils/account'
import { saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { saveOffer } from '../../utils/offer'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { ConfirmCancelTrade } from './ConfirmCancelTrade'
import { getSellerCanceledTitle } from './getSellerCanceledTitle'
import { cancelContractAsBuyer } from './helpers/cancelContractAsBuyer'
import { cancelContractAsSeller } from './helpers/cancelContractAsSeller'
import { RequestSent } from './RequestSent'

export const useConfirmCancelTrade = () => {
  const [, updateOverlay] = useOverlayContext()
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])

  const cancelBuyer = useCallback(
    async (contract: Contract) => {
      updateOverlay({ title: i18n('contract.cancel.tradeCanceled'), visible: true })
      const result = await cancelContractAsBuyer(contract)

      if (result.isError() || !result.isOk()) {
        showError(result.isError() ? result.getError() : undefined)
        return
      }
      saveContract(result.getValue().contract)
      navigation.replace('contract', { contractId: contract.id })
    },
    [navigation, showError, updateOverlay],
  )

  const cancelSeller = useCallback(
    async (contract: Contract) => {
      const isCash = isCashTrade(contract.paymentMethod)
      updateOverlay({
        title: getSellerCanceledTitle(contract.paymentMethod),
        visible: true,
        content: isCash ? undefined : <RequestSent />,
      })

      const result = await cancelContractAsSeller(contract)

      if (result.isError() || !result.isOk()) {
        showError(result.isError() ? result.getError() : undefined)
        return
      }

      const { contract: contractUpdate, sellOffer } = result.getValue()
      saveContract(contractUpdate)
      if (sellOffer) saveOffer(sellOffer)
      navigation.replace('contract', { contractId: contract.id })
    },
    [updateOverlay, navigation, showError],
  )

  const showConfirmOverlay = useCallback(
    (contract: Contract) => {
      const view = account.publicKey === contract?.seller.id ? 'seller' : 'buyer'
      const cancelAction = () => (view === 'seller' ? cancelSeller(contract) : cancelBuyer(contract))
      const title = i18n(isCashTrade(contract.paymentMethod) ? 'contract.cancel.cash.title' : 'contract.cancel.title')
      updateOverlay({
        title,
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

  return { showConfirmOverlay, cancelSeller, cancelBuyer, closeOverlay }
}
