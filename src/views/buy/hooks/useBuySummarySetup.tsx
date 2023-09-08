import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useConfigStore } from '../../../store/configStore'
import { useOfferPreferences } from '../../../store/offerPreferenes/useOfferPreferences'
import { useSettingsStore } from '../../../store/settingsStore'
import { account, getMessageToSignForAddress } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { getError, getResult } from '../../../utils/result'
import { Err, Result } from '../../../utils/result/types'
import { isValidBitcoinSignature } from '../../../utils/validation'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { publishBuyOffer } from '../helpers/publishBuyOffer'

type MessageSigningData = {
  releaseAddress: string
  message: string
  messageSignature: string
}
export const useBuySummarySetup = () => {
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()
  const hasSeenGroupHugAnnouncement = useConfigStore((state) => state.hasSeenGroupHugAnnouncement)

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

  const goToMessageSigning = () => navigation.navigate('signMessage')

  const getMessageSigningData = async (): Promise<
    Result<MessageSigningData, Error> | Err<Error, MessageSigningData>
  > => {
    const { address, index } = peachWalletActive
      ? await peachWallet.getReceivingAddress()
      : { address: payoutAddress, index: 0 }
    if (!address) return getError(new Error('MISSING_ADDRESS'))

    const messageToSign = getMessageToSignForAddress(account.publicKey, address)
    const signature = peachWalletActive
      ? peachWallet.signMessage(messageToSign, address, index)
      : payoutAddressSignature || ''

    if (!isValidBitcoinSignature(messageToSign, address, signature)) return getError(new Error('INAVLID_SIGNATURE'))

    return getResult({
      releaseAddress: address,
      message: messageToSign,
      messageSignature: signature,
    })
  }

  const buyOfferPreferences = useOfferPreferences(
    (state) => ({
      amount: state.buyAmountRange,
      meansOfPayment: state.meansOfPayment,
      paymentData: state.paymentData,
      originalPaymentData: state.originalPaymentData,
      maxPremium: state.filter.buyOffer.maxPremium,
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
    const messageSigningData = await getMessageSigningData()

    if (messageSigningData.getError()) {
      showErrorBanner(messageSigningData.getError())
      setIsPublishing(false)
      return
    }
    const { offerId, isOfferPublished, errorMessage } = await publishBuyOffer({
      ...offerDraft,
      ...messageSigningData.getValue(),
    })
    setIsPublishing(false)

    if (!isOfferPublished || !offerId) {
      showErrorBanner(errorMessage)
    } else if (!hasSeenGroupHugAnnouncement) {
      navigation.replace('groupHugAnnouncement', { offerId })
    } else {
      navigation.replace('offerPublished', { offerId, isSellOffer: false })
    }
  }

  useEffect(() => {
    if (peachWalletActive) {
      setCanPublish(true)
      return
    }
    if (!payoutAddress || !payoutAddressSignature) {
      setCanPublish(false)
      return
    }

    const messageToSign = getMessageToSignForAddress(account.publicKey, payoutAddress)
    setCanPublish(isValidBitcoinSignature(messageToSign, payoutAddress, payoutAddressSignature))
  }, [payoutAddress, payoutAddressSignature, peachWalletActive])

  useEffect(() => {
    setOfferDraft((prev) => ({ ...prev, walletLabel: peachWalletActive ? i18n('peachWallet') : payoutAddressLabel }))
  }, [payoutAddressLabel, peachWalletActive])

  return {
    peachWalletActive,
    canPublish,
    publishOffer,
    isPublishing,
    goToMessageSigning,
    offerDraft,
  }
}
