import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { PopupAction } from '../../components/popup'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { useNavigation } from '../../hooks/useNavigation'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useSettingsStore } from '../../store/settingsStore'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import { useAccountStore } from '../../utils/account/account'
import { getSellOfferFromContract } from '../../utils/contract/getSellOfferFromContract'
import { getWalletLabelFromContract } from '../../utils/contract/getWalletLabelFromContract'
import i18n from '../../utils/i18n'
import { getOfferExpiry } from '../../utils/offer/getOfferExpiry'
import { saveOffer } from '../../utils/offer/saveOffer'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { peachAPI } from '../../utils/peachAPI'
import { GrayPopup } from '../GrayPopup'
import { ClosePopupAction } from '../actions'
import { LoadingPopupAction } from '../actions/LoadingPopupAction'
import { ConfirmCancelTrade } from './ConfirmCancelTrade'
import { SellerCanceledContent } from './SellerCanceledContent'
import { getSellerCanceledTitle } from './getSellerCanceledTitle'
import { cancelContractAsSeller } from './helpers/cancelContractAsSeller'

export const useConfirmCancelTrade = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const [customPayoutAddress, customPayoutAddressLabel, isPeachWalletActive] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutAddressLabel, state.peachWalletActive],
    shallow,
  )
  const publicKey = useAccountStore((state) => state.account.publicKey)

  const cancelBuyer = useCallback(
    async (contractId: string) => {
      setPopup(
        <GrayPopup title={i18n('contract.cancel.success')} actions={<ClosePopupAction style={tw`justify-center`} />} />,
      )
      const { error } = await peachAPI.private.contract.cancelContract({ contractId })

      if (error?.error) {
        showError(error.error)
        return
      }
      navigation.replace('contract', { contractId })
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
      setPopup(
        <GrayPopup
          title={getSellerCanceledTitle(contract.paymentMethod)}
          content={<SellerCanceledContent {...{ isCash, canRepublish, tradeID: contract.id, walletName }} />}
          actions={<ClosePopupAction style={tw`justify-center`} />}
        />,
      )

      const { result, error } = await cancelContractAsSeller(contract)

      if (error || !result) {
        showError(error)
        return
      }

      const { sellOffer } = result
      if (sellOffer) saveOffer(sellOffer)
      navigation.replace('contract', { contractId: contract.id })
    },
    [customPayoutAddress, customPayoutAddressLabel, isPeachWalletActive, setPopup, navigation, showError],
  )

  const showConfirmPopup = useCallback(
    (contract: Contract) => {
      const view = publicKey === contract?.seller.id ? 'seller' : 'buyer'
      const cancelAction = () => (view === 'seller' ? cancelSeller(contract) : cancelBuyer(contract.id))
      const title = i18n(isCashTrade(contract.paymentMethod) ? 'contract.cancel.cash.title' : 'contract.cancel.title')
      setPopup(
        <PopupComponent
          title={title}
          content={<ConfirmCancelTrade {...{ contract, view }} />}
          actions={
            <>
              <PopupAction label={i18n('contract.cancel.confirm.back')} iconId="arrowLeftCircle" onPress={closePopup} />
              <LoadingPopupAction
                label={i18n('contract.cancel.title')}
                iconId="xCircle"
                onPress={cancelAction}
                reverseOrder
              />
            </>
          }
          actionBgColor={tw`bg-black-50`}
          bgColor={tw`bg-primary-background-light`}
        />,
      )
    },
    [publicKey, setPopup, closePopup, cancelSeller, cancelBuyer],
  )

  return showConfirmPopup
}
