import React, { useCallback, useContext } from 'react'
import { Loading } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { extendPaymentTimer } from '../../utils/peachAPI'
import { useConfirmCancelTrade } from '../tradeCancelation/useConfirmCancelTrade'
import { PaymentTimerHasRunOut } from './PaymentTimerHasRunOut'

export const useShowPaymentTimerHasRunOut = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const navigation = useNavigation()
  const cancelTradeOverlay = useConfirmCancelTrade()
  const showError = useShowErrorBanner()

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])

  const showPaymentTimerHasRunOutForBuyer = useCallback(
    (contract: Contract, inTrade: boolean) => {
      const closeAction: Action = {
        label: i18n('close'),
        icon: 'xSquare',
        callback: () => closeOverlay(),
      }
      const goToContract: Action = {
        label: i18n('checkTrade'),
        icon: 'arrowLeftCircle',
        callback: () => {
          closeOverlay()
          navigation.navigate('contract', { contractId: contract.id })
        },
      }

      updateOverlay({
        title: i18n('contract.buyer.paymentTimerHasRunOut.title'),
        content: <PaymentTimerHasRunOut {...{ contract, view: 'buyer' }} />,
        visible: true,
        level: 'APP',
        action1: inTrade ? closeAction : goToContract,
        action2: inTrade ? undefined : closeAction,
      })
    },
    [closeOverlay, navigation, updateOverlay],
  )

  const showPaymentTimerHasRunOutForSeller = useCallback(
    (contract: Contract, inTrade: boolean) => {
      const closeAction: Action = {
        label: i18n('close'),
        icon: 'xSquare',
        callback: () => closeOverlay(),
      }
      const cancelTrade: Action = {
        label: i18n('contract.seller.paymentTimerHasRunOut.cancelTrade'),
        icon: 'xSquare',
        callback: () => cancelTradeOverlay(contract),
      }
      const extraTime: Action = {
        label: i18n('contract.seller.paymentTimerHasRunOut.extraTime'),
        icon: 'clock',
        callback: async () => {
          updateOverlay({
            title: i18n('contract.buyer.paymentTimerHasRunOut.title'),
            content: <Loading style={tw`self-center`} color={tw`text-black-1`.color} />,
            level: 'WARN',
            visible: true,
            requireUserAction: true,
            action1: {
              label: i18n('loading'),
              icon: 'clock',
              callback: () => {},
            },
          })

          const [result, err] = await extendPaymentTimer({ contractId: contract.id })
          if (!result || err) showError(err?.error)

          closeOverlay()
        },
      }

      updateOverlay({
        title: i18n('contract.seller.paymentTimerHasRunOut.title'),
        content: <PaymentTimerHasRunOut {...{ contract, view: 'seller' }} />,
        visible: true,
        level: 'WARN',
        action1: inTrade ? extraTime : closeAction,
        action2: inTrade ? cancelTrade : closeAction,
      })
    },
    [cancelTradeOverlay, closeOverlay, showError, updateOverlay],
  )

  const showPaymentTimerHasRunOut = useCallback(
    (contract: Contract, view: ContractViewer, inTrade: boolean) =>
      view === 'buyer'
        ? showPaymentTimerHasRunOutForBuyer(contract, inTrade)
        : showPaymentTimerHasRunOutForSeller(contract, inTrade),
    [showPaymentTimerHasRunOutForBuyer, showPaymentTimerHasRunOutForSeller],
  )

  return showPaymentTimerHasRunOut
}
