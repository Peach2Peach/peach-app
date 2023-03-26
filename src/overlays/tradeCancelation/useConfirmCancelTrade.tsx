import { useCallback, useContext } from 'react';
import { Loading } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import { checkRefundPSBT, signPSBT } from '../../utils/bitcoin'
import { getSellOfferFromContract, isPaymentTimeExpired, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { saveOffer } from '../../utils/offer'
import { cancelContract, patchOffer } from '../../utils/peachAPI'
import { ConfirmCancelTrade } from './ConfirmCancelTrade'

/**
 * @description Overlay the seller sees when requesting cancelation
 */
export const useConfirmCancelTrade = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])
  const showLoading = useCallback(
    () =>
      updateOverlay({
        title: i18n('contract.cancel.title'),
        level: 'ERROR',
        content: <Loading style={tw`self-center`} color={tw`text-primary-main`.color} />,
        visible: true,
        action1: {
          label: i18n('loading'),
          icon: 'clock',
          callback: () => {},
        },
      }),
    [updateOverlay],
  )
  const cancelBuyer = useCallback(
    async (contract: Contract) => {
      showLoading()
      const [result, err] = await cancelContract({
        contractId: contract.id,
      })

      if (result) {
        saveContract({
          ...contract,
          canceled: true,
          cancelConfirmationDismissed: false,
        })
        navigation.replace('contract', { contractId: contract.id, contract })
        updateOverlay({ title: i18n('contract.cancel.success'), visible: true, level: 'APP' })
      } else if (err) {
        closeOverlay()
        showError(err.error)
      }
    },
    [closeOverlay, navigation, showError, showLoading, updateOverlay],
  )

  const cancelSellerSuccess = useCallback(
    (contract: Contract) => {
      navigation.replace('contract', { contractId: contract.id })
      saveContract({
        ...contract,
        cancelConfirmationDismissed: false,
        cancelationRequested: true,
        cancelConfirmationPending: true,
      })
    },
    [navigation],
  )

  const patchSellOfferWithRefundTx = useCallback(
    async (contract: Contract, refundPSBT: string) => {
      const sellOffer = getSellOfferFromContract(contract)
      const { isValid, psbt, err: checkRefundPSBTError } = checkRefundPSBT(refundPSBT, sellOffer)
      if (isValid && psbt) {
        const signedPSBT = signPSBT(psbt, sellOffer, false)
        const [patchOfferResult, patchOfferError] = await patchOffer({
          offerId: sellOffer.id,
          refundTx: signedPSBT.toBase64(),
        })
        if (patchOfferResult) {
          saveOffer({
            ...sellOffer,
            refundTx: psbt.toBase64(),
          })
          cancelSellerSuccess(contract)
        } else if (patchOfferError) {
          showError(patchOfferError?.error)
        }
      } else if (checkRefundPSBTError) {
        showError(checkRefundPSBTError)
      }
    },
    [cancelSellerSuccess, showError],
  )

  const cancelSeller = useCallback(
    async (contract: Contract) => {
      showLoading()
      const [result, err] = await cancelContract({
        contractId: contract.id,
      })

      if (result && isPaymentTimeExpired(contract)) {
        saveContract({
          ...contract,
          cancelConfirmationDismissed: false,
          canceled: true,
        })
      }

      if (result?.success) {
        if (result.psbt) {
          await patchSellOfferWithRefundTx(contract, result.psbt)
        } else {
          cancelSellerSuccess(contract)
        }
      } else if (err) {
        showError(err?.error)
      }
      closeOverlay()
    },
    [showLoading, closeOverlay, patchSellOfferWithRefundTx, cancelSellerSuccess, showError],
  )

  const showConfirmOverlay = useCallback(
    (contract: Contract) => {
      const view = account.publicKey === contract?.seller.id ? 'seller' : 'buyer'

      updateOverlay({
        title: i18n('contract.cancel.title'),
        level: 'ERROR',
        content: <ConfirmCancelTrade view={view} />,
        visible: true,
        action1: {
          label: i18n('contract.cancel.title'),
          icon: 'xCircle',
          callback: () => (view === 'seller' ? cancelSeller(contract) : cancelBuyer(contract)),
        },
        action2: {
          label: i18n('contract.cancel.confirm.back'),
          icon: 'arrowLeftCircle',
          callback: closeOverlay,
        },
      })
    },
    [updateOverlay, cancelSeller, cancelBuyer, closeOverlay],
  )

  return { showConfirmOverlay, cancelSeller }
}
