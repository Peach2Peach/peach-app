import { NETWORK } from '@env'
import React, { useContext } from 'react'
import { Loading } from '../components'
import { OverlayContext } from '../contexts/overlay'
import { useNavigation } from '../hooks'
import { useShowErrorBanner } from '../hooks/useShowErrorBanner'
import { tradeSummaryStore } from '../store/tradeSummaryStore'
import tw from '../styles/tailwind'
import { checkAndRefund, showTransaction } from '../utils/bitcoin'
import i18n from '../utils/i18n'
import { info } from '../utils/log'
import { saveOffer } from '../utils/offer'
import { cancelOffer } from '../utils/peachAPI'
import { peachWallet } from '../utils/wallet/setWallet'

import Refund from './Refund'

export const useStartRefundOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const showError = useShowErrorBanner()
  const navigation = useNavigation()

  const closeOverlay = () => updateOverlay({ visible: false })
  const goToWallet = (txId: string) => {
    closeOverlay()
    navigation.navigate('transactionDetails', { txId })
  }

  const refund = async (sellOffer: SellOffer, rawPSBT: string) => {
    info('Get refunding info', rawPSBT)
    const { psbt, tx, txId, err } = await checkAndRefund(rawPSBT, sellOffer)
    if (psbt && tx && txId) {
      const address = psbt.txOutputs[0].address
      const isPeachWallet = address ? !!peachWallet.findKeyPairByAddress(address) : false
      saveOffer({
        ...sellOffer,
        tx,
        txId,
        refunded: true,
      })
      tradeSummaryStore.getState().setOffer(sellOffer.id, { txId })
      updateOverlay({
        title: i18n('refund.title'),
        content: <Refund isPeachWallet={isPeachWallet} />,
        visible: true,
        action1: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: () => {
            closeOverlay()
            navigation.navigate('offer', { offerId: sellOffer.id })
          },
        },
        action2: {
          label: i18n(isPeachWallet ? 'goToWallet' : 'showTx'),
          icon: isPeachWallet ? 'wallet' : 'externalLink',
          callback: () => (isPeachWallet ? goToWallet(txId) : showTransaction(txId, NETWORK)),
        },
        level: 'APP',
      })
    } else if (err) {
      showError(err)
      closeOverlay()
    }
  }

  const startRefund = async (sellOffer: SellOffer) => {
    updateOverlay({
      title: i18n('refund.loading.title'),
      content: <Loading style={tw`self-center`} color={tw`text-primary-main`.color} />,
      level: 'APP',
      visible: true,
      requireUserAction: true,
      action1: {
        label: i18n('loading'),
        icon: 'clock',
        callback: () => {},
      },
    })

    const [cancelResult, cancelError] = await cancelOffer({ offerId: sellOffer.id })

    if (cancelResult) {
      await refund(sellOffer, cancelResult.psbt)
    } else {
      showError(cancelError?.error)
      closeOverlay()
    }
  }

  return startRefund
}
