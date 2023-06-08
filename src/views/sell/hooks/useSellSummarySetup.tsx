import { useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
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

  const publishOffer = async (offerDraft: SellOfferDraft) => {
    if (isPublishing) return
    setIsPublishing(true)
    const { isPublished, navigationParams, errorMessage } = await publishSellOffer(offerDraft)
    if (isPublished && navigationParams) {
      navigation.reset({
        index: 1,
        routes: [
          { name: 'yourTrades', params: { tab: 'sell' } },
          { name: 'fundEscrow', params: navigationParams },
        ],
      })
    } else if (errorMessage) {
      showErrorBanner(errorMessage)
    }
    setIsPublishing(false)
  }
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('sell.summary.title'),
        icons: [{ ...headerIcons.wallet, onPress: () => navigation.navigate('selectWallet', { type: 'refund' }) }],
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
        const { address } = await peachWallet.getReceivingAddress()
        setReturnAddress(address || '')
      } else {
        setReturnAddress(payoutAddress || '')
      }
    })()
  }, [payoutAddress, peachWalletActive])

  return { returnAddress, walletLabel, canPublish, publishOffer, isPublishing }
}
