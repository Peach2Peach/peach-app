import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowLoadingPopup } from '../../../hooks/useShowLoadingPopup'
import { usePopupStore } from '../../../store/usePopupStore'
import { contractIdToHex, getSellOfferFromContract, saveContract, verifyAndSignReleaseTx } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { peachAPI } from '../../../utils/peachAPI'
import { getEscrowWalletForOffer } from '../../../utils/wallet'
import { DisputeLostBuyer } from '../components/DisputeLostBuyer'
import { DisputeLostSeller } from '../components/DisputeLostSeller'
import { NonDispute } from '../components/NonDispute'

export const useDisputeResults = () => {
  const navigation = useNavigation()
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const showError = useShowErrorBanner()
  const showLoadingPopup = useShowLoadingPopup()
  const showDisputeResults = useCallback(
    (contract: Contract, view: ContractViewer) => {
      const saveAcknowledgeMent = () => {
        saveContract({
          ...contract,
          disputeResultAcknowledged: true,
          cancelConfirmationDismissed: view === 'buyer',
          disputeResolvedDate: new Date(),
        })
      }

      const goToChat = () => {
        saveAcknowledgeMent()
        closePopup()
        navigation.navigate('contractChat', { contractId: contract.id })
      }

      const release = async () => {
        showLoadingPopup({
          title: i18n('dispute.lost'),
          level: 'WARN',
        })
        const sellOffer = getSellOfferFromContract(contract)
        const { releaseTransaction, batchReleasePsbt, errorMsg } = verifyAndSignReleaseTx(
          contract,
          sellOffer,
          getEscrowWalletForOffer(sellOffer),
        )
        if (!releaseTransaction) {
          closePopup()
          return showError(errorMsg)
        }

        const { result, error: err } = await peachAPI.private.contract.confirmPayment({
          contractId: contract.id,
          releaseTransaction,
          batchReleasePsbt,
        })
        if (err) {
          closePopup()
          return showError(err.error)
        }

        saveContract({
          ...contract,
          paymentConfirmed: new Date(),
          cancelConfirmationDismissed: true,
          releaseTxId: result?.txId || '',
          disputeResultAcknowledged: true,
          disputeResolvedDate: new Date(),
        })
        return closePopup()
      }

      const tradeId = contractIdToHex(contract.id)

      if (!contract.disputeWinner) return setPopup({
        title: i18n('dispute.closed'),
        level: 'WARN',
        content: <NonDispute tradeId={tradeId} />,
        visible: true,
        action2: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: () => {
            saveAcknowledgeMent()
            closePopup()
            navigation.replace('contract', { contractId: contract.id })
          },
        },
        action1: {
          label: i18n('goToChat'),
          icon: 'messageCircle',
          callback: goToChat,
        },
      })

      if (contract.disputeWinner === view) return null
      if (view === 'buyer') return setPopup({
        title: i18n('dispute.lost'),
        level: 'WARN',
        content: <DisputeLostBuyer tradeId={tradeId} />,
        visible: true,
        action2: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: () => {
            saveAcknowledgeMent()
            closePopup()
          },
        },
        action1: {
          label: i18n('goToChat'),
          icon: 'messageCircle',
          callback: goToChat,
        },
      })
      return setPopup({
        title: i18n('dispute.lost'),
        level: 'WARN',
        content: <DisputeLostSeller tradeId={tradeId} isCompleted={!!contract.releaseTxId || contract.canceled} />,
        visible: true,
        action1:
          !contract.releaseTxId && !contract.canceled
            ? {
              label: i18n('dispute.seller.lost.button'),
              icon: 'sell',
              callback: release,
            }
            : {
              label: i18n('close'),
              icon: 'xSquare',
              callback: () => {
                saveAcknowledgeMent()
                closePopup()
              },
            },
      })
    },
    [setPopup, closePopup, navigation, showLoadingPopup, showError],
  )

  return showDisputeResults
}
