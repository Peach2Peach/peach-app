import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { WalletIcon } from '../../../components/icons'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useSettingsStore } from '../../../store/settingsStore'
import { account, getMessageToSignForAddress } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { isValidBitcoinSignature } from '../../../utils/validation'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { publishBuyOffer } from '../helpers/publishBuyOffer'

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
    peachWalletActive,
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
