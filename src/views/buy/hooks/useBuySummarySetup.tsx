import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useSettingsStore } from '../../../store/settingsStore'
import { useOfferPreferences } from '../../../store/offerPreferenes/useOfferPreferences'
import { account, getMessageToSignForAddress } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { isValidBitcoinSignature } from '../../../utils/validation'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { publishBuyOffer } from '../helpers/publishBuyOffer'

export const useBuySummarySetup = () => {
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel, payoutAddressSignature]
    = useSettingsStore(
      (state) => [
        state.peachWalletActive,
        state.setPeachWalletActive,
        state.payoutAddress,
        state.payoutAddressLabel,
        state.payoutAddressSignature,
      ],
      shallow,
    )

  if (!peachWalletActive && !payoutAddress) setPeachWalletActive(true)

  const [canPublish, setCanPublish] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [messageSignature, setMessageSignature] = useState(
    !peachWalletActive && payoutAddressSignature ? payoutAddressSignature : '',
  )

  const goToMessageSigning = () => navigation.navigate('signMessage')

  const buyOfferPreferences = useOfferPreferences(
    (state) => ({
      amount: state.buyAmountRange,
      meansOfPayment: state.meansOfPayment,
      paymentData: state.paymentData,
      originalPaymentData: state.originalPaymentData,
    }),
    shallow,
  )
  const [offerDraft, setOfferDraft] = useState<BuyOfferDraft>({
    type: 'bid',
    releaseAddress: '',
    ...buyOfferPreferences,
  })

  const publishOffer = async () => {
    if (isPublishing) return
    setIsPublishing(true)
    const { offerId, isOfferPublished, errorMessage } = await publishBuyOffer(offerDraft)
    setIsPublishing(false)

    if (!isOfferPublished || !offerId) {
      showErrorBanner(errorMessage)
    } else {
      navigation.replace('offerPublished', { offerId, isSellOffer: false })
    }
  }

  useHeaderSetup({
    title: i18n('buy.summary.title'),
    icons: [{ ...headerIcons.wallet, onPress: () => navigation.navigate('selectWallet', { type: 'payout' }) }],
  })

  useEffect(() => {
    ;(async () => {
      const address = peachWalletActive ? await peachWallet.getReceivingAddress() : payoutAddress
      if (!address) return

      const messageToSign = getMessageToSignForAddress(account.publicKey, address)
      const newSignature = peachWalletActive
        ? peachWallet.signMessage(messageToSign, address)
        : payoutAddressSignature || ''
      setMessageSignature(newSignature)
      setOfferDraft((prev) => ({
        ...prev,
        releaseAddress: address,
        message: messageToSign,
        messageSignature: newSignature,
      }))
      setCanPublish(isValidBitcoinSignature(messageToSign, address, newSignature))
    })()
  }, [payoutAddress, payoutAddressSignature, peachWalletActive])

  useEffect(() => {
    setOfferDraft((prev) => ({ ...prev, walletLabel: peachWalletActive ? i18n('peachWallet') : payoutAddressLabel }))
  }, [payoutAddressLabel, peachWalletActive])

  return {
    peachWalletActive,
    messageSignature,
    canPublish,
    publishOffer,
    isPublishing,
    goToMessageSigning,
    offerDraft,
  }
}
