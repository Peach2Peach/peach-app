import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useSettingsStore } from '../../../store/settingsStore'
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

  const [releaseAddress, setReleaseAddress] = useState('')
  const [message, setMessage] = useState('')
  const [canPublish, setCanPublish] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [messageSignature, setMessageSignature] = useState(
    !peachWalletActive && payoutAddressSignature ? payoutAddressSignature : '',
  )
  const walletLabel = peachWalletActive ? i18n('peachWallet') : payoutAddressLabel

  const goToMessageSigning = () => navigation.navigate('signMessage')

  const publishOffer = async (offerDraft: BuyOfferDraft) => {
    if (isPublishing) return
    setIsPublishing(true)
    const { isOfferPublished, errorMessage } = await publishBuyOffer(offerDraft)
    setIsPublishing(false)

    if (!isOfferPublished) {
      showErrorBanner(errorMessage)
    } else {
      navigation.replace('offerPublished', { isSellOffer: false })
    }
  }

  useHeaderSetup({
    title: i18n('buy.summary.title'),
    icons: [{ ...headerIcons.wallet, onPress: () => navigation.navigate('selectWallet', { type: 'payout' }) }],
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
    peachWalletActive,
    releaseAddress,
    walletLabel,
    message,
    messageSignature,
    canPublish,
    publishOffer,
    isPublishing,
    goToMessageSigning,
  }
}
