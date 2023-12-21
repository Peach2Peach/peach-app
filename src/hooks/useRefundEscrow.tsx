import { NETWORK } from '@env'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useSetOverlay } from '../Overlay'
import { PopupAction } from '../components/popup'
import { PopupComponent } from '../components/popup/PopupComponent'
import { FIFTEEN_SECONDS } from '../constants'
import { Refund } from '../popups/Refund'
import { useSettingsStore } from '../store/settingsStore'
import { useTradeSummaryStore } from '../store/tradeSummaryStore'
import { usePopupStore } from '../store/usePopupStore'
import { checkRefundPSBT } from '../utils/bitcoin/checkRefundPSBT'
import { showTransaction } from '../utils/bitcoin/showTransaction'
import { signAndFinalizePSBT } from '../utils/bitcoin/signAndFinalizePSBT'
import { getAbortWithTimeout } from '../utils/getAbortWithTimeout'
import i18n from '../utils/i18n'
import { info } from '../utils/log'
import { saveOffer } from '../utils/offer/saveOffer'
import { peachAPI } from '../utils/peachAPI'
import { getEscrowWalletForOffer } from '../utils/wallet/getEscrowWalletForOffer'
import { BackupTime } from '../views/overlays/BackupTime'
import { useTradeSummaries } from './query/useTradeSummaries'
import { useNavigation } from './useNavigation'
import { useShowErrorBanner } from './useShowErrorBanner'

export const useRefundEscrow = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const showError = useShowErrorBanner()
  const navigation = useNavigation()
  const isPeachWallet = useSettingsStore((state) => state.peachWalletActive)
  const [setShowBackupReminder, shouldShowBackupOverlay] = useSettingsStore((state) => [
    state.setShowBackupReminder,
    state.shouldShowBackupOverlay,
  ])
  const { refetch: refetchTradeSummaries } = useTradeSummaries(false)
  const setOverlay = useSetOverlay()
  const goToWallet = useCallback(
    (txId: string) => {
      closePopup()
      if (shouldShowBackupOverlay && isPeachWallet) {
        setOverlay(<BackupTime navigationParams={[{ name: 'transactionDetails', params: { txId } }]} />)
      } else {
        navigation.navigate('transactionDetails', { txId })
      }
    },
    [closePopup, isPeachWallet, navigation, setOverlay, shouldShowBackupOverlay],
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

      setPopup(
        <PopupComponent
          title={i18n('refund.title')}
          content={<Refund isPeachWallet={isPeachWallet} />}
          actions={
            <>
              <PopupAction
                label={i18n(isPeachWallet ? 'goToWallet' : 'showTx')}
                iconId={isPeachWallet ? 'wallet' : 'externalLink'}
                onPress={() => {
                  if (isPeachWallet) {
                    goToWallet(txId)
                  } else {
                    closePopup()
                    setOverlay(
                      <BackupTime
                        navigationParams={[
                          {
                            name: 'homeScreen',
                            params: { screen: 'yourTrades', params: { tab: 'yourTrades.sell' } },
                          },
                        ]}
                      />,
                    )
                    showTransaction(txId, NETWORK)
                  }
                }}
              />
              <PopupAction
                label={i18n('close')}
                iconId="xSquare"
                onPress={() => {
                  closePopup()
                  if (shouldShowBackupOverlay && isPeachWallet) {
                    setOverlay(
                      <BackupTime navigationParams={[{ name: 'homeScreen', params: { screen: 'yourTrades' } }]} />,
                    )
                  } else {
                    navigation.navigate('homeScreen', { screen: 'yourTrades', params: { tab: 'yourTrades.history' } })
                  }
                }}
                reverseOrder
              />
            </>
          }
        />,
      )

      const { error: postTXError } = await peachAPI.private.offer.refundSellOffer({
        offerId: sellOffer.id,
        tx,
        signal: getAbortWithTimeout(FIFTEEN_SECONDS).signal,
      })
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
      setOverlay,
      setPopup,
      setShowBackupReminder,
      shouldShowBackupOverlay,
      showError,
    ],
  )

  return refundEscrow
}
