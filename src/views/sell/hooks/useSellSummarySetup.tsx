import { useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useSettingsStore } from '../../../store/settingsStore'
import { useOfferPreferences } from '../../../store/offerPreferenes/useOfferPreferences'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { defaultFundingStatus } from '../../../utils/offer/constants'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { publishSellOffer } from '../helpers/publishSellOffer'
import { useGlobalSortAndFilterPopup } from '../../search/hooks/useSortAndFilterPopup'

export const useSellSummarySetup = () => {
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.setPeachWalletActive, state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )

  if (!peachWalletActive && !payoutAddress) setPeachWalletActive(true)

  const [isPublishing, setIsPublishing] = useState(false)
  const [canPublish, setCanPublish] = useState(false)

  const sellPreferences = useOfferPreferences(
    (state) => ({
      amount: state.sellAmount,
      premium: state.premium,
      meansOfPayment: state.meansOfPayment,
      paymentData: state.paymentData,
      originalPaymentData: state.originalPaymentData,
      multi: state.multi,
    }),
    shallow,
  )
  const [offerDraft, setOfferDraft] = useState<SellOfferDraft>({
    type: 'ask',
    returnAddress: '',
    funding: defaultFundingStatus,
    ...sellPreferences,
  })

  const publishOffer = async () => {
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
  useSellSummaryHeaderSetup()

  useEffect(() => {
    ;(async () => {
      const { address } = peachWalletActive ? await peachWallet.getReceivingAddress() : { address: payoutAddress }
      setCanPublish(!!address)
      if (!address) return
      setOfferDraft((prev) => ({
        ...prev,
        returnAddress: address,
      }))
    })()
  }, [payoutAddress, peachWalletActive])

  useEffect(() => {
    const walletLabel = peachWalletActive ? i18n('peachWallet') : payoutAddressLabel
    if (walletLabel) setOfferDraft((prev) => ({
      ...prev,
      walletLabel,
    }))
  }, [payoutAddressLabel, peachWalletActive])

  return { canPublish, publishOffer, isPublishing, offerDraft }
}

function useSellSummaryHeaderSetup () {
  const navigation = useNavigation()
  const showSortAndFilterPopup = useGlobalSortAndFilterPopup('sell')
  const icons = useMemo(
    () => [
      { ...headerIcons.sellFilter, onPress: showSortAndFilterPopup },
      { ...headerIcons.wallet, onPress: () => navigation.navigate('selectWallet', { type: 'refund' }) },
    ],
    [navigation, showSortAndFilterPopup],
  )
  useHeaderSetup({
    title: i18n('sell.summary.title'),
    icons,
  })
}
