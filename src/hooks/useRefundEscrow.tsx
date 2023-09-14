import { NETWORK } from '@env'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '.'
import { FIFTEEN_SECONDS } from '../constants'
import { Refund } from '../popups/Refund'
import { useSettingsStore } from '../store/settingsStore'
import { useTradeSummaryStore } from '../store/tradeSummaryStore'
import { usePopupStore } from '../store/usePopupStore'
import { checkRefundPSBT, showTransaction, signAndFinalizePSBT } from '../utils/bitcoin'
import i18n from '../utils/i18n'
import { info } from '../utils/log'
import { saveOffer } from '../utils/offer'
import { refundSellOffer } from '../utils/peachAPI'
import { getEscrowWalletForOffer } from '../utils/wallet'
import { useSyncWallet } from '../views/wallet/hooks/useSyncWallet'
import { useTradeSummaries } from './query/useTradeSummaries'
import { useShowErrorBanner } from './useShowErrorBanner'

export const useRefundEscrow = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const { refresh } = useSyncWallet()
  const showError = useShowErrorBanner()
  const navigation = useNavigation()
  const isPeachWallet = useSettingsStore((state) => state.peachWalletActive)
  const [setShowBackupReminder, shouldShowBackupOverlay] = useSettingsStore((state) => [
    state.setShowBackupReminder,
    state.shouldShowBackupOverlay,
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

  const refundEscrow = useCallback(
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
            if (shouldShowBackupOverlay && isPeachWallet) {
              navigation.navigate('backupTime', { nextScreen: 'yourTrades' })
            } else {
              navigation.navigate('yourTrades', { tab: 'history' })
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

      const [, postTXError] = await refundSellOffer({ offerId: sellOffer.id, tx, timeout: FIFTEEN_SECONDS })
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
        refresh()
        if (shouldShowBackupOverlay && isPeachWallet) {
          setShowBackupReminder(true)
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
      setShowBackupReminder,
      shouldShowBackupOverlay,
      showError,
    ],
  )

  return refundEscrow
}
