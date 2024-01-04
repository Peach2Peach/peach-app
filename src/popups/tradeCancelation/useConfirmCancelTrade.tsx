import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { PopupAction } from '../../components/popup'
import { useClosePopup, useSetPopup } from '../../components/popup/Popup'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import { useAccountStore } from '../../utils/account/account'
import { getSellOfferFromContract } from '../../utils/contract/getSellOfferFromContract'
import { getWalletLabelFromContract } from '../../utils/contract/getWalletLabelFromContract'
import i18n from '../../utils/i18n'
import { getOfferExpiry } from '../../utils/offer/getOfferExpiry'
import { saveOffer } from '../../utils/offer/saveOffer'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { peachAPI } from '../../utils/peachAPI'
import { useContractMutation } from '../../views/contract/hooks/useContractMutation'
import { GrayPopup } from '../GrayPopup'
import { ClosePopupAction } from '../actions/ClosePopupAction'
import { LoadingPopupAction } from '../actions/LoadingPopupAction'
import { ConfirmCancelTrade } from './ConfirmCancelTrade'
import { SellerCanceledContent } from './SellerCanceledContent'
import { getSellerCanceledTitle } from './getSellerCanceledTitle'
import { cancelContractAsSeller } from './helpers/cancelContractAsSeller'

export const useConfirmCancelTrade = () => {
  const setPopup = useSetPopup()
  const closePopup = useClosePopup()
  const [customPayoutAddress, customPayoutAddressLabel, isPeachWalletActive] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutAddressLabel, state.peachWalletActive],
    shallow,
  )
  const publicKey = useAccountStore((state) => state.account.publicKey)

  const { mutate: cancelBuyer } = useContractMutation(
    { canceled: true, tradeStatus: 'tradeCanceled' },
    {
      mutationFn: async ({ contractId }: { contractId: string }) => {
        setPopup(
          <GrayPopup
            title={i18n('contract.cancel.success')}
            actions={<ClosePopupAction style={tw`justify-center`} />}
          />,
        )
        const { error } = await peachAPI.private.contract.cancelContract({ contractId })
        if (error?.error) throw new Error(error.error)
      },
    },
  )

  const { mutate: cancelSeller } = useContractMutation(
    {},
    {
      mutationFn: async ({ contract }: { contract: Contract }) => {
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

        if (error) throw new Error(error)
        return result
      },
      onSuccess: (result) => {
        const { sellOffer } = result
        if (sellOffer) saveOffer(sellOffer)
      },
    },
  )

  const showConfirmPopup = useCallback(
    (contract: Contract) => {
      const view = publicKey === contract?.seller.id ? 'seller' : 'buyer'
      const cancelAction = () =>
        view === 'seller' ? cancelSeller({ contract }) : cancelBuyer({ contractId: contract.id })
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
