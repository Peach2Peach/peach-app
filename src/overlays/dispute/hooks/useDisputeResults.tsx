import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { contractIdToHex, saveContract, signReleaseTx } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { confirmPayment } from '../../../utils/peachAPI'
import { DisputeLostBuyer } from '../components/DisputeLostBuyer'
import { DisputeLostSeller } from '../components/DisputeLostSeller'
import DisputeWon from '../components/DisputeWon'
import NonDispute from '../components/NonDispute'

export const useDisputeResults = () => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)

  const showError = useShowErrorBanner()

  return useCallback(
    (contract: Contract, view: ContractViewer) => {
      const goToChat = () => {
        saveContract({
          ...contract,
          disputeResultAcknowledged: true,
          cancelConfirmationDismissed: true,
        })
        navigation.navigate('contractChat', { contractId: contract.id })
        updateOverlay({ visible: false })
      }

      const goToContract = () => {
        navigation.navigate('contract', { contractId: contract.id })
        updateOverlay({ visible: false })
      }

      const closeOverlay = () => {
        saveContract({
          ...contract,
          disputeResultAcknowledged: true,
          cancelConfirmationDismissed: true,
        })
        goToContract()
      }

      const release = async () => {
        const [tx, errorMsg] = signReleaseTx(contract)
        if (!tx) return showError(errorMsg)

        const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })
        if (err) return showError(err.error)

        saveContract({
          ...contract,
          paymentConfirmed: new Date(),
          releaseTxId: result?.txId || '',
          disputeResultAcknowledged: true,
        })
        return closeOverlay()
      }

      const tradeId = contractIdToHex(contract.id)

      return !!contract.disputeWinner
        ? contract.disputeWinner === view
          ? updateOverlay({
            title: i18n('dispute.won'),
            level: 'SUCCESS',
            content: <DisputeWon tradeId={tradeId} />,
            visible: true,
            action2: {
              label: i18n('close'),
              icon: 'xSquare',
              callback: closeOverlay,
            },
            action1: {
              label: i18n('goToChat'),
              icon: 'messageCircle',
              callback: goToChat,
            },
          })
          : view === 'buyer'
            ? updateOverlay({
              title: i18n('dispute.lost'),
              level: 'WARN',
              content: <DisputeLostBuyer tradeId={tradeId} />,
              visible: true,
              action2: {
                label: i18n('close'),
                icon: 'xSquare',
                callback: closeOverlay,
              },
              action1: {
                label: i18n('goToChat'),
                icon: 'messageCircle',
                callback: goToChat,
              },
            })
            : updateOverlay({
              title: i18n('dispute.lost'),
              level: 'WARN',
              content: <DisputeLostSeller tradeId={tradeId} />,
              visible: true,
              action1: {
                label: i18n('dispute.seller.lost.button'),
                icon: 'sell',
                callback: release,
              },
            })
        : updateOverlay({
          title: i18n('dispute.closed'),
          level: 'WARN',
          content: <NonDispute tradeId={tradeId} />,
          visible: true,
          action2: {
            label: i18n('close'),
            icon: 'xSquare',
            callback: closeOverlay,
          },
          action1: {
            label: i18n('goToChat'),
            icon: 'messageCircle',
            callback: goToChat,
          },
        })
    },
    [navigation, showError, updateOverlay],
  )
}
