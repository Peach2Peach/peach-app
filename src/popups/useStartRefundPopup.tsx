import { NETWORK } from '@env'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../hooks'
import { useTradeSummaries } from '../hooks/query/useTradeSummaries'
import { useShowErrorBanner } from '../hooks/useShowErrorBanner'
import { useShowLoadingPopup } from '../hooks/useShowLoadingPopup'
import { useSettingsStore } from '../store/settingsStore'
import { useTradeSummaryStore } from '../store/tradeSummaryStore'
import { usePopupStore } from '../store/usePopupStore'
import { checkRefundPSBT, showTransaction, signAndFinalizePSBT } from '../utils/bitcoin'
import i18n from '../utils/i18n'
import { info } from '../utils/log'
import { saveOffer } from '../utils/offer'
import { cancelOffer, refundSellOffer } from '../utils/peachAPI'
import { getEscrowWalletForOffer } from '../utils/wallet'
import { peachWallet } from '../utils/wallet/setWallet'
import { Refund } from './Refund'

export const useStartRefundPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showError = useShowErrorBanner()
  const navigation = useNavigation()
  const isPeachWallet = useSettingsStore((state) => state.peachWalletActive)
  const [setShowBackupReminder, shouldShowBackupOverlay, setShouldShowBackupOverlay] = useSettingsStore((state) => [
    state.setShowBackupReminder,
    state.shouldShowBackupOverlay?.refundedEscrow,
    state.setShouldShowBackupOverlay,
  ])
  const { refetch: refetchTradeSummaries } = useTradeSummaries(false)
  const goToWallet = useCallback(
    (txId: string) => {
      closePopup()
      if (shouldShowBackupOverlay && isPeachWallet) {
        navigation.navigate('backupTime', { nextScreen: 'transactionDetails', txId })
      } else {
        navigation.navigate('transactionDetails', { txId })
      }
    },
    [closePopup, isPeachWallet, navigation, shouldShowBackupOverlay],
  )
  const setOffer = useTradeSummaryStore((state) => state.setOffer)

  const refund = useCallback(
    async (sellOffer: SellOffer, rawPSBT: string) => {
      info('Get refunding info', rawPSBT)
      const { psbt, err } = checkRefundPSBT(rawPSBT, sellOffer)

      if (!psbt || err) {
        showError(err)
        closePopup()
        return
      }
      const signedTx = signAndFinalizePSBT(psbt, getEscrowWalletForOffer(sellOffer)).extractTransaction()
      const [tx, txId] = [signedTx.toHex(), signedTx.getId()]

      setPopup({
        title: i18n('refund.title'),
        content: <Refund isPeachWallet={isPeachWallet} />,
        visible: true,
        requireUserAction: true,
        action1: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: () => {
            closePopup()
            navigation.navigate('yourTrades', { tab: 'history' })
            if (shouldShowBackupOverlay && isPeachWallet) {
              navigation.navigate('backupTime', { nextScreen: 'yourTrades' })
            }
          },
        },
        action2: {
          label: i18n(isPeachWallet ? 'goToWallet' : 'showTx'),
          icon: isPeachWallet ? 'wallet' : 'externalLink',
          callback: () => {
            if (isPeachWallet) {
              goToWallet(txId)
            } else {
              closePopup()
              navigation.navigate('backupTime', { nextScreen: 'yourTrades', tab: 'sell' })

              showTransaction(txId, NETWORK)
            }
          },
        },
        level: 'APP',
      })

      const [, postTXError] = await refundSellOffer({ offerId: sellOffer.id, tx, timeout: 15 * 1000 })
      if (postTXError) {
        showError(postTXError.error)
        closePopup()
      } else {
        saveOffer({
          ...sellOffer,
          tx,
          txId,
          refunded: true,
        })
        setOffer(sellOffer.id, { txId })
        refetchTradeSummaries()
        peachWallet.syncWallet()
        if (shouldShowBackupOverlay && isPeachWallet) {
          setShowBackupReminder(true)
          setShouldShowBackupOverlay('refundedEscrow', false)
        }
      }
    },
    [
      closePopup,
      goToWallet,
      isPeachWallet,
      navigation,
      refetchTradeSummaries,
      setOffer,
      setPopup,
      setShouldShowBackupOverlay,
      setShowBackupReminder,
      shouldShowBackupOverlay,
      showError,
    ],
  )
  const showLoadingPopup = useShowLoadingPopup()

  const startRefund = useCallback(
    async (sellOffer: SellOffer) => {
      showLoadingPopup({
        title: i18n('refund.loading.title'),
      })

      const [cancelResult, cancelError] = await cancelOffer({ offerId: sellOffer.id, timeout: 15 * 1000 })

      if (cancelResult) {
        await refund(sellOffer, cancelResult.psbt)
      } else {
        showError(cancelError?.error)
        closePopup()
      }
    },
    [closePopup, refund, showError, showLoadingPopup],
  )

  return startRefund
}
