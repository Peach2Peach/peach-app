import { useMemo } from 'react'
import { Header, PeachScrollView, PrimaryButton, Screen } from '../../components'
import { SellOfferSummary } from '../../components/offer'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { useGlobalSortAndFilterPopup } from '../search/hooks/useSortAndFilterPopup'
import { useSellSummarySetup } from './hooks/useSellSummarySetup'

export const SellSummary = () => {
  const { canPublish, publishOffer, isPublishing, offerDraft } = useSellSummarySetup()

  return (
    <Screen header={<SellSummaryHeader />}>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        <SellOfferSummary offer={offerDraft} />
      </PeachScrollView>
      <PrimaryButton
        style={tw`self-center`}
        narrow
        onPress={canPublish ? publishOffer : undefined}
        disabled={!canPublish}
        loading={isPublishing}
      >
        {i18n('next')}
      </PrimaryButton>
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
