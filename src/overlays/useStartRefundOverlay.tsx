import { NETWORK } from '@env'
import { useCallback } from 'react'
import { useOverlayContext } from '../contexts/overlay'
import { useNavigation } from '../hooks'
import { useTradeSummaries } from '../hooks/query/useTradeSummaries'
import { useShowErrorBanner } from '../hooks/useShowErrorBanner'
import { useShowLoadingOverlay } from '../hooks/useShowLoadingOverlay'
import { useSettingsStore } from '../store/settingsStore'
import { useTradeSummaryStore } from '../store/tradeSummaryStore'
import { checkRefundPSBT, showTransaction, signAndFinalizePSBT } from '../utils/bitcoin'
import i18n from '../utils/i18n'
import { info } from '../utils/log'
import { saveOffer } from '../utils/offer'
import { cancelOffer, refundSellOffer } from '../utils/peachAPI'
import { getEscrowWalletForOffer } from '../utils/wallet'
import { peachWallet } from '../utils/wallet/setWallet'
import { Refund } from './Refund'

export const useStartRefundOverlay = () => {
  const [, updateOverlay] = useOverlayContext()
  const showError = useShowErrorBanner()
  const navigation = useNavigation()
  const { refetch: refetchTradeSummaries } = useTradeSummaries(false)
  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])
  const goToWallet = useCallback(
    (txId: string) => {
      closeOverlay()
      navigation.navigate('transactionDetails', { txId })
    },
    [closeOverlay, navigation],
  )
  const setOffer = useTradeSummaryStore((state) => state.setOffer)
  const isPeachWallet = useSettingsStore((state) => state.peachWalletActive)

  const refund = useCallback(
    async (sellOffer: SellOffer, rawPSBT: string) => {
      info('Get refunding info', rawPSBT)
      const { psbt, err } = checkRefundPSBT(rawPSBT, sellOffer)

      if (!psbt || err) {
        showError(err)
        closeOverlay()
        return
      }
      const signedTx = signAndFinalizePSBT(psbt, getEscrowWalletForOffer(sellOffer)).extractTransaction()
      const [tx, txId] = [signedTx.toHex(), signedTx.getId()]

      updateOverlay({
        title: i18n('refund.title'),
        content: <Refund isPeachWallet={isPeachWallet} />,
        visible: true,
        requireUserAction: true,
        action1: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: () => {
            closeOverlay()
            navigation.navigate('yourTrades', { tab: 'history' })
          },
        },
        action2: {
          label: i18n(isPeachWallet ? 'goToWallet' : 'showTx'),
          icon: isPeachWallet ? 'wallet' : 'externalLink',
          callback: () => {
            if (isPeachWallet) {
              goToWallet(txId)
            } else {
              closeOverlay()
              showTransaction(txId, NETWORK)
            }
          },
        },
        level: 'APP',
      })

      const [, postTXError] = await refundSellOffer({ offerId: sellOffer.id, tx, timeout: 15 * 1000 })
      if (postTXError) {
        showError(postTXError.error)
        closeOverlay()
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
      }
    },
    [closeOverlay, goToWallet, isPeachWallet, navigation, refetchTradeSummaries, setOffer, showError, updateOverlay],
  )
  const showLoadingOverlay = useShowLoadingOverlay()

  const startRefund = useCallback(
    async (sellOffer: SellOffer) => {
      showLoadingOverlay({
        title: i18n('refund.loading.title'),
      })

      const [cancelResult, cancelError] = await cancelOffer({ offerId: sellOffer.id, timeout: 15 * 1000 })

      if (cancelResult) {
        await refund(sellOffer, cancelResult.psbt)
      } else {
        showError(cancelError?.error)
        closeOverlay()
      }
    },
    [closeOverlay, refund, showError, showLoadingOverlay],
  )

  return startRefund
}
