import { useCallback, useContext } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowLoadingOverlay } from '../../../hooks/useShowLoadingOverlay'
import { contractIdToHex, getSellOfferFromContract, saveContract, verifyAndSignReleaseTx } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { confirmPayment } from '../../../utils/peachAPI'
import { getEscrowWalletForOffer } from '../../../utils/wallet'
import { DisputeLostBuyer } from '../components/DisputeLostBuyer'
import { DisputeLostSeller } from '../components/DisputeLostSeller'
import NonDispute from '../components/NonDispute'

export const useDisputeResults = () => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const showError = useShowErrorBanner()
  const showLoadingOverlay = useShowLoadingOverlay()
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
      const closeOverlay = () => {
        updateOverlay({ visible: false })
      }

      const goToChat = () => {
        saveAcknowledgeMent()
        closeOverlay()
        navigation.navigate('contractChat', { contractId: contract.id })
      }

      const release = async () => {
        showLoadingOverlay({
          title: i18n('dispute.lost'),
          level: 'WARN',
        })
        const sellOffer = getSellOfferFromContract(contract)
        const [tx, errorMsg] = verifyAndSignReleaseTx(contract, sellOffer, getEscrowWalletForOffer(sellOffer))
        if (!tx) {
          closeOverlay()
          return showError(errorMsg)
        }

        const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })
        if (err) {
          closeOverlay()
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
        return closeOverlay()
      }

      const tradeId = contractIdToHex(contract.id)

      if (!contract.disputeWinner) return updateOverlay({
        title: i18n('dispute.closed'),
        level: 'WARN',
        content: <NonDispute tradeId={tradeId} />,
        visible: true,
        action2: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: () => {
            saveAcknowledgeMent()
            closeOverlay()
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
      if (view === 'buyer') return updateOverlay({
        title: i18n('dispute.lost'),
        level: 'WARN',
        content: <DisputeLostBuyer tradeId={tradeId} />,
        visible: true,
        action2: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: () => {
            saveAcknowledgeMent()
            closeOverlay()
          },
        },
        action1: {
          label: i18n('goToChat'),
          icon: 'messageCircle',
          callback: goToChat,
        },
      })
      return updateOverlay({
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
                closeOverlay()
              },
            },
      })
    },
    [navigation, showError, showLoadingOverlay, updateOverlay],
  )

  return showDisputeResults
}
