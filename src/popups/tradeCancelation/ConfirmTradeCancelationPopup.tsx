import { shallow } from 'zustand/shallow'
import { useClosePopup, useSetPopup } from '../../components/popup/Popup'
import { PopupAction } from '../../components/popup/PopupAction'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { ClosePopupAction } from '../../components/popup/actions/ClosePopupAction'
import { LoadingPopupAction } from '../../components/popup/actions/LoadingPopupAction'
import { MSINAMINUTE } from '../../constants'
import { useSettingsStore } from '../../store/settingsStore/useSettingsStore'
import tw from '../../styles/tailwind'
import { getSellOfferFromContract } from '../../utils/contract/getSellOfferFromContract'
import { getWalletLabelFromContract } from '../../utils/contract/getWalletLabelFromContract'
import i18n from '../../utils/i18n'
import { saveOffer } from '../../utils/offer/saveOffer'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { peachAPI } from '../../utils/peachAPI'
import { useContractMutation } from '../../views/contract/hooks/useContractMutation'
import { GrayPopup } from '../GrayPopup'
import { cancelContractAsSeller } from './cancelContractAsSeller'

export function ConfirmTradeCancelationPopup ({ contract, view }: { contract: Contract; view: ContractViewer }) {
  const setPopup = useSetPopup()
  const closePopup = useClosePopup()
  const { mutate: cancelSeller } = useContractMutation(contract, {
    mutationFn: async () => {
      setPopup(<CancelPopup contract={contract} view={view} />)

      const { result, error } = await cancelContractAsSeller(contract)

      if (error) throw new Error(error)
      return result
    },
    onSuccess: (result) => {
      const { sellOffer } = result
      if (sellOffer) saveOffer(sellOffer)
    },
  })
  const { mutate: cancelBuyer } = useContractMutation(
    { id: contract.id, canceled: true, tradeStatus: 'tradeCanceled' },
    {
      mutationFn: async () => {
        setPopup(
          <GrayPopup
            title={i18n('contract.cancel.success')}
            actions={<ClosePopupAction style={tw`justify-center`} />}
          />,
        )
        const { error } = await peachAPI.private.contract.cancelContract({ contractId: contract.id })
        if (error?.error) throw new Error(error.error)
      },
    },
  )
  const cancelAction = () => (view === 'seller' ? cancelSeller() : cancelBuyer())
  const title = i18n(isCashTrade(contract.paymentMethod) ? 'contract.cancel.cash.title' : 'contract.cancel.title')
  const isCash = isCashTrade(contract.paymentMethod)

  return (
    <PopupComponent
      title={title}
      content={i18n(isCash ? 'contract.cancel.cash.text' : `contract.cancel.${view}`)}
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
    />
  )
}

function CancelPopup ({ contract, view }: { contract: Contract; view: ContractViewer }) {
  const [customAddress, customAddressLabel, isPeachWalletActive] = useSettingsStore(
    (state) =>
      view === 'buyer'
        ? [state.payoutAddress, state.payoutAddressLabel, state.payoutToPeachWallet]
        : [state.refundAddress, state.refundAddressLabel, state.refundToPeachWallet],
    shallow,
  )
  const { paymentMethod, id } = contract
  const isCash = isCashTrade(paymentMethod)
  const canRepublish = !isOfferExpired(getSellOfferFromContract(contract))
  const walletName = getWalletLabelFromContract({
    contract,
    customAddress,
    customAddressLabel,
    isPeachWalletActive,
  })
  return (
    <GrayPopup
      title={i18n(isCashTrade(paymentMethod) ? 'contract.cancel.tradeCanceled' : 'contract.cancel.requestSent')}
      content={
        isCash
          ? canRepublish
            ? i18n('contract.cancel.cash.refundOrRepublish.text')
            : i18n('contract.cancel.cash.tradeCanceled.text', id, walletName)
          : i18n('contract.cancel.requestSent.text')
      }
      actions={<ClosePopupAction style={tw`justify-center`} />}
    />
  )
}

function isOfferExpired (offer: SellOffer) {
  const NUMBER_OF_MINUTES = 10
  const ttl = (offer.funding.expiry * NUMBER_OF_MINUTES * MSINAMINUTE) / 2

  const date = new Date(offer.publishingDate || offer.creationDate)
  date.setMilliseconds(+ttl)

  return new Date() > date
}
