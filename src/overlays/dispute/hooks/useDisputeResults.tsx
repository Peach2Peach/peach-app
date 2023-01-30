import React, { useCallback, useContext } from 'react'
import { View } from 'react-native'
import { MessageContext } from '../../../contexts/message'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import { account } from '../../../utils/account'
import { contractIdToHex, saveContract, signReleaseTx } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { error } from '../../../utils/log'
import { confirmPayment } from '../../../utils/peachAPI'
import { DisputeLostBuyer } from '../DisputeLostBuyer'
import { DisputeLostSeller } from '../DisputeLostSeller'
import DisputeWon from '../DisputeWon'

export const useDisputeResults = () => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  return useCallback(
    (contract: Contract, view: ContractViewer) => {
      const goToChat = () => navigation.navigate('contractChat', { contractId: contract.id })

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
        updateOverlay({ visible: false })
      }

      const release = async () => {
        const [tx, errorMsg] = signReleaseTx(contract)
        if (!tx) {
          updateMessage({
            msgKey: errorMsg || 'GENERAL_ERROR',
            level: 'WARN',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          })
          return
        }
        const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })
        if (err) {
          error(err.error)
          updateMessage({
            msgKey: err.error || 'GENERAL_ERROR',
            level: 'ERROR',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          })
          return
        }
        saveContract({
          ...contract,
          paymentConfirmed: new Date(),
          releaseTxId: result?.txId || '',
          disputeResultAcknowledged: true,
        })
        closeOverlay()
      }

      const tradeId = contractIdToHex(contract.id)

      return !!contract.disputeWinner
        ? contract.disputeWinner === account.publicKey
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
          title: i18n('dispute.opened'),
          level: 'WARN',
          content: <View></View>,
          visible: true,
        })
    },
    [navigation, updateMessage, updateOverlay],
  )
}
