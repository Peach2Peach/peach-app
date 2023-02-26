import React, { useEffect, useState } from 'react'
import shallow from 'zustand/shallow'
import { WalletIcon } from '../../../components/icons'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import pgp from '../../../init/pgp'
import { useSettingsStore } from '../../../store/settingsStore'
import { account, getMessageToSignForAddress, updateTradingLimit } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { saveOffer } from '../../../utils/offer'
import { getOfferDetails, getTradingLimit, postBuyOffer } from '../../../utils/peachAPI'
import { isValidBitcoinSignature } from '../../../utils/validation'
import { peachWallet } from '../../../utils/wallet/setWallet'

const getAndUpdateTradingLimit = () =>
  getTradingLimit({}).then(([tradingLimit]) => {
    if (tradingLimit) {
      updateTradingLimit(tradingLimit)
    }
  })

export const useBuySummarySetup = () => {
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const [peachWalletActive, payoutAddress, payoutAddressLabel, payoutAddressSignature] = useSettingsStore(
    (state) => [state.peachWalletActive, state.payoutAddress, state.payoutAddressLabel, state.payoutAddressSignature],
    shallow,
  )
  const [releaseAddress, setReleaseAddress] = useState('')
  const [message, setMessage] = useState('')
  const [canPublish, setCanPublish] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [messageSignature, setMessageSignature] = useState(
    !peachWalletActive && payoutAddressSignature ? payoutAddressSignature : '',
  )
  const walletLabel = peachWalletActive ? i18n('peachWallet') : payoutAddressLabel

  const goToSetupPayoutWallet = () =>
    payoutAddress ? navigation.navigate('signMessage') : navigation.navigate('payoutAddress', { type: 'payout' })

  const publishOffer = async (offerDraft: BuyOfferDraft) => {
    setIsPublishing(true)

    await pgp() // make sure pgp has been sent
    const [result, err] = await postBuyOffer(offerDraft)

    if (result) {
      getAndUpdateTradingLimit()
      const [offer] = await getOfferDetails({ offerId: result.offerId })
      // Note that previously we always saved the offerDraft as if it were an offer,
      // but now we only save it if the server returns it.
      if (offer) {
        saveOffer(offer)
      }
      navigation.replace('offerPublished', { isSellOffer: false })
      return
    }

    setIsPublishing(false)
    showErrorBanner(err?.error || 'POST_OFFER_ERROR')
  }

  useHeaderSetup({
    title: i18n('buy.summary.title'),
    icons: [{ iconComponent: <WalletIcon />, onPress: () => navigation.navigate('selectWallet', { type: 'payout' }) }],
  })

  useEffect(() => {
    setCanPublish(isValidBitcoinSignature(message, releaseAddress, messageSignature))
  }, [releaseAddress, message, messageSignature])

  useEffect(() => {
    ;(async () => {
      const address = peachWalletActive ? await peachWallet.getReceivingAddress() : payoutAddress
      if (!address) return

      const messageToSign = getMessageToSignForAddress(account.publicKey, address)
      setReleaseAddress(address)
      setMessage(messageToSign)
      setMessageSignature(
        peachWalletActive ? peachWallet.signMessage(messageToSign, address) : payoutAddressSignature || '',
      )
    })()
  }, [payoutAddress, payoutAddressSignature, peachWalletActive])

  return {
    releaseAddress,
    walletLabel,
    message,
    messageSignature,
    canPublish,
    publishOffer,
    isPublishing,
    goToSetupPayoutWallet,
  }
}
