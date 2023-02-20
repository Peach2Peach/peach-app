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
import { getTradingLimit, postSellOffer } from '../../../utils/peachAPI'
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

  const publishOffer = async (offer: SellOfferDraft) => {
    setIsPublishing(true)
    info('Posting offer ', JSON.stringify(offer))

    await pgp() // make sure pgp has been sent

    const [result, err] = await postSellOffer({
      type: offer.type,
      amount: offer.amount,
      premium: offer.premium,
      meansOfPayment: offer.meansOfPayment,
      paymentData: offer.paymentData,
      returnAddress: offer.returnAddress,
    })
    if (result) {
      info('Posted offer', result)

      getAndUpdateTradingLimit()

      navigation.replace('fundEscrow', { offer: { ...offer, id: result.offerId } as SellOffer })
    } else if (err) {
      showErrorBanner(i18n(err?.error || 'POST_OFFER_ERROR', ((err?.details as string[]) || []).join(', ')))
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
