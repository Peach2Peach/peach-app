import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { publishSellOffer } from '../helpers/publishSellOffer'

export const useSellSummarySetup = () => {
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.setPeachWalletActive, state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )

  if (!peachWalletActive && !payoutAddress) setPeachWalletActive(true)

  const [returnAddress, setReturnAddress] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [canPublish, setCanPublish] = useState(false)

  const walletLabel = peachWalletActive ? i18n('peachWallet') : payoutAddressLabel

  const goToSetupRefundWallet = () => navigation.navigate('payoutAddress', { type: 'refund' })

  const publishOffer = async (offerDraft: SellOfferDraft) => {
    if (isPublishing) return
    setIsPublishing(true)
    const { isPublished, navigationParams, errorMessage } = await publishSellOffer(offerDraft)
    if (isPublished && navigationParams) {
      navigation.replace('fundEscrow', navigationParams)
    } else if (errorMessage) {
      showErrorBanner(errorMessage)
    }
    setIsPublishing(false)
  }
  useHeaderSetup({
    title: i18n('sell.summary.title'),
  })

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
