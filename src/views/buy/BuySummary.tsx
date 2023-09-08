import { useMemo } from 'react'
import { NewHeader as Header, PeachScrollView, PrimaryButton, Screen } from '../../components'
import { BuyOfferSummary } from '../../components/offer'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { useGlobalSortAndFilterPopup } from '../search/hooks/useSortAndFilterPopup'
import { useBuySummarySetup } from './hooks/useBuySummarySetup'

const getButtonTextId = (canPublish: boolean, isPublishing: boolean) => {
  if (isPublishing) return 'offer.publishing'
  if (canPublish) return 'offer.publish'
  return 'next'
}

export const BuySummary = () => {
  const { canPublish, publishOffer, isPublishing, goToMessageSigning, offerDraft } = useBuySummarySetup()

  return (
    <Screen>
      <BuySummaryHeader />
      <PeachScrollView contentContainerStyle={[tw`justify-center flex-grow py-sm`, tw.md`py-md`]}>
        <BuyOfferSummary offer={offerDraft} />
      </PeachScrollView>
      <PrimaryButton
        style={tw`self-center mt-2 mb-5`}
        narrow
        onPress={canPublish ? publishOffer : goToMessageSigning}
        loading={isPublishing}
      >
        {i18n(getButtonTextId(canPublish, isPublishing))}
      </PrimaryButton>
    </Screen>
  )
}

function BuySummaryHeader () {
  const navigation = useNavigation()
  const showSortAndFilterPopup = useGlobalSortAndFilterPopup('buy')
  const icons = useMemo(
    () => [
      {
        ...headerIcons.bitcoin,
        accessibilityHint: `${i18n('goTo')} ${i18n('settings.networkFees')}`,
        onPress: () => navigation.navigate('networkFees'),
      },
      { ...headerIcons.buyFilter, onPress: showSortAndFilterPopup },
      { ...headerIcons.wallet, onPress: () => navigation.navigate('selectWallet', { type: 'payout' }) },
    ],
    [navigation, showSortAndFilterPopup],
  )
  return <Header title={i18n('buy.summary.title')} icons={icons} />
}
