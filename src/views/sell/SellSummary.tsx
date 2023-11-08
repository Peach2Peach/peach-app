import { useMemo } from 'react'
import { Header, PeachScrollView, Screen } from '../../components'
import { Button } from '../../components/buttons/Button'
import { SellOfferSummary } from '../../components/offer'
import { useNavigation } from '../../hooks'
import { useOfferPreferences } from '../../store/offerPreferenes'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { useGlobalSortAndFilterPopup } from '../search/hooks/useSortAndFilterPopup'
import { useSellSummarySetup } from './hooks/useSellSummarySetup'

export const SellSummary = () => {
  const { canPublish, publishOffer, isPublishing, offerDraft } = useSellSummarySetup()
  const numberOfOffers = useOfferPreferences((state) => state.multi)

  return (
    <Screen header={<SellSummaryHeader />}>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        <SellOfferSummary offer={offerDraft} numberOfOffers={numberOfOffers} />
      </PeachScrollView>
      <Button
        style={tw`self-center`}
        onPress={canPublish ? publishOffer : undefined}
        disabled={!canPublish}
        loading={isPublishing}
      >
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
