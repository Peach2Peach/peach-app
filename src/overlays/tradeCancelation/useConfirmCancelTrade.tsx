import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useSettingsStore } from '../../store/settingsStore'
import { usePopupStore } from '../../store/usePopupStore'
import { account } from '../../utils/account'
import { getSellOfferFromContract, saveContract } from '../../utils/contract'
import { getWalletLabelFromContract } from '../../utils/contract/getWalletLabelFromContract'
import i18n from '../../utils/i18n'
import { getOfferExpiry, saveOffer } from '../../utils/offer'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { ConfirmCancelTrade } from './ConfirmCancelTrade'
import { SellerCanceledContent } from './SellerCanceledContent'
import { getSellerCanceledTitle } from './getSellerCanceledTitle'
import { cancelContractAsBuyer } from './helpers/cancelContractAsBuyer'
import { cancelContractAsSeller } from './helpers/cancelContractAsSeller'

export const useConfirmCancelTrade = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const [customPayoutAddress, customPayoutAddressLabel, isPeachWalletActive] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutAddressLabel, state.peachWalletActive],
    shallow,
  )

  const cancelBuyer = useCallback(
    async (contract: Contract) => {
      setPopup({ title: i18n('contract.cancel.success'), visible: true, level: 'DEFAULT' })
      const result = await cancelContractAsBuyer(contract)

      if (result.isError() || !result.isOk()) {
        showError(result.isError() ? result.getError() : undefined)
        return
      }
      saveContract(result.getValue().contract)
      navigation.replace('contract', { contractId: contract.id })
    },
    [navigation, showError, setPopup],
  )

  const cancelSeller = useCallback(
    async (contract: Contract) => {
      const isCash = isCashTrade(contract.paymentMethod)
      const canRepublish = !getOfferExpiry(getSellOfferFromContract(contract)).isExpired
      const walletName = getWalletLabelFromContract({
        contract,
        customPayoutAddress,
        customPayoutAddressLabel,
        isPeachWalletActive,
      })
      setPopup({
        title: getSellerCanceledTitle(contract.paymentMethod),
        visible: true,
        level: 'DEFAULT',
        content: <SellerCanceledContent {...{ isCash, canRepublish, tradeID: contract.id, walletName }} />,
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
    [customPayoutAddress, customPayoutAddressLabel, isPeachWalletActive, setPopup, navigation, showError],
  )

  const showConfirmOverlay = useCallback(
    (contract: Contract) => {
      const view = account.publicKey === contract?.seller.id ? 'seller' : 'buyer'
      const cancelAction = () => (view === 'seller' ? cancelSeller(contract) : cancelBuyer(contract))
      const title = i18n(isCashTrade(contract.paymentMethod) ? 'contract.cancel.cash.title' : 'contract.cancel.title')
      setPopup({
        title,
        level: 'DEFAULT',
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
          callback: closePopup,
        },
      })
    },
    [setPopup, cancelSeller, cancelBuyer, closePopup],
  )

  return { showConfirmOverlay, cancelSeller, cancelBuyer, closePopup }
}
