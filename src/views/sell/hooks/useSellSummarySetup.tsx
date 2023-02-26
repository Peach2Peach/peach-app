import React, { useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'
import { WalletIcon } from '../../../components/icons'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import pgp from '../../../init/pgp'
import { useSettingsStore } from '../../../store/settingsStore'
import { updateTradingLimit } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { info } from '../../../utils/log'
import { isSellOffer } from '../../../utils/offer'
import { getOfferDetails, getTradingLimit, postSellOffer } from '../../../utils/peachAPI'
import { peachWallet } from '../../../utils/wallet/setWallet'

const getAndUpdateTradingLimit = () =>
  getTradingLimit({}).then(([tradingLimit]) => {
    if (tradingLimit) {
      updateTradingLimit(tradingLimit)
    }
  })

export const useSellSummarySetup = () => {
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const [peachWalletActive, payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )
  const [returnAddress, setReturnAddress] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [canPublish, setCanPublish] = useState(false)

  const walletLabel = peachWalletActive ? i18n('peachWallet') : payoutAddressLabel

  const goToSetupRefundWallet = () => navigation.navigate('payoutAddress', { type: 'refund' })

  const publishOffer = async (offerDraft: SellOfferDraft) => {
    setIsPublishing(true)
    info('Posting offer ', JSON.stringify(offerDraft))

    await pgp() // make sure pgp has been sent

    const [result, err] = await postSellOffer({
      type: offerDraft.type,
      amount: offerDraft.amount,
      premium: offerDraft.premium,
      meansOfPayment: offerDraft.meansOfPayment,
      paymentData: offerDraft.paymentData,
      returnAddress: offerDraft.returnAddress,
    })
    if (result) {
      info('Posted offer', result)

      getAndUpdateTradingLimit()
      const [offer] = await getOfferDetails({ offerId: result.offerId })
      if (offer && isSellOffer(offer)) {
        navigation.replace('fundEscrow', { offer: { ...offerDraft, ...offer } })
      }
    } else if (err) {
      showErrorBanner(i18n(err.error || 'POST_OFFER_ERROR', ((err.details as string[]) || []).join(', ')))
    }
    setIsPublishing(false)
  }
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('sell.summary.title'),
        icons: [
          {
            iconComponent: <WalletIcon />,
            onPress: () => navigation.navigate('selectWallet', { type: 'refund' }),
          },
        ],
      }),
      [navigation],
    ),
  )

  useEffect(() => {
    setCanPublish(!!returnAddress)
  }, [returnAddress])

  useEffect(() => {
    ;(async () => {
      if (peachWalletActive) {
        setReturnAddress((await peachWallet.getReceivingAddress()) || '')
      } else {
        setReturnAddress(payoutAddress || '')
      }
    })()
  }, [payoutAddress, peachWalletActive])

  return { returnAddress, walletLabel, goToSetupRefundWallet, canPublish, publishOffer, isPublishing }
}
