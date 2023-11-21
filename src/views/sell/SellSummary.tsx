import { useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { Header, PeachScrollView, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { SellOfferSummary } from '../../components/offer'
import { useNavigation } from '../../hooks'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { defaultFundingStatus } from '../../utils/offer/constants'
import { peachWallet } from '../../utils/wallet/setWallet'
import { useGlobalSortAndFilterPopup } from '../search/hooks/useSortAndFilterPopup'
import { publishSellOffer } from './helpers/publishSellOffer'

export const SellSummary = () => {
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.setPeachWalletActive, state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )

  if (!peachWalletActive && !payoutAddress) setPeachWalletActive(true)

  const [isPublishing, setIsPublishing] = useState(false)

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

  const publishOffer = async () => {
    if (isPublishing) return
    setIsPublishing(true)
    const { address } = peachWalletActive ? await peachWallet.getReceivingAddress() : { address: payoutAddress }
    if (!address) {
      setIsPublishing(false)
      return
    }

    const { isPublished, navigationParams, errorMessage } = await publishSellOffer({
      ...sellPreferences,
      type: 'ask',
      funding: defaultFundingStatus,
      walletLabel: peachWalletActive ? i18n('peachWallet') : payoutAddressLabel,
      returnAddress: address,
    })
    if (isPublished && navigationParams) {
      navigation.reset({
        index: 1,
        routes: [
          { name: 'yourTrades', params: { tab: 'yourTrades.sell' } },
          { name: 'fundEscrow', params: navigationParams },
        ],
      })
    } else if (errorMessage) {
      showErrorBanner(errorMessage)
      setIsPublishing(false)
    }
  }
  const numberOfOffers = useOfferPreferences((state) => state.multi)

  return (
    <Screen header={<SellSummaryHeader />}>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        <SellOfferSummary
          offer={sellPreferences}
          numberOfOffers={numberOfOffers}
          walletLabel={
            <Text style={tw`text-center subtitle-1`}>
              {peachWalletActive ? i18n('peachWallet') : payoutAddressLabel}
            </Text>
          }
        />
      </PeachScrollView>
      <Button style={tw`self-center`} onPress={publishOffer} loading={isPublishing}>
        {i18n('next')}
      </Button>
    </Screen>
  )
}

function SellSummaryHeader () {
  const navigation = useNavigation()
  const showSortAndFilterPopup = useGlobalSortAndFilterPopup('sell')
  const icons = useMemo(
    () => [
      { ...headerIcons.sellFilter, onPress: showSortAndFilterPopup },
      { ...headerIcons.wallet, onPress: () => navigation.navigate('selectWallet', { type: 'refund' }) },
    ],
    [navigation, showSortAndFilterPopup],
  )
  return <Header title={i18n('sell.summary.title')} icons={icons} />
}
