import { useCallback, useMemo } from 'react'
import { Header } from '../../components/Header'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Screen } from '../../components/Screen'
import { Matches } from '../../components/matches/Matches'
import { useCancelOffer, useNavigation, useRoute, useShowHelp } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import tw from '../../styles/tailwind'
import { headerIcons } from '../../utils/layout/headerIcons'
import { isBuyOffer } from '../../utils/offer/isBuyOffer'
import { isSellOffer } from '../../utils/offer/isSellOffer'
import { offerIdToHex } from '../../utils/offer/offerIdToHex'
import { NoMatchesYet } from './components'
import { useSearchSetup } from './hooks'
import { useSortAndFilterPopup } from './hooks/useSortAndFilterPopup'

export const Search = () => {
  const { hasMatches, offer } = useSearchSetup()
  if (!offer) return <></>
  return (
    <Screen style={hasMatches && tw`px-0`} header={<SearchHeader />} showTradingLimit>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`} bounces={false}>
        {hasMatches ? <Matches /> : <NoMatchesYet offer={offer} />}
      </PeachScrollView>
    </Screen>
  )
}

function SearchHeader () {
  const { offerId } = useRoute<'search'>().params
  const { offer } = useOfferDetails(offerId)
  const navigation = useNavigation()
  const showMatchPopup = useShowHelp('matchmatchmatch')
  const showAcceptMatchPopup = useShowHelp('acceptMatch')
  const showSortAndFilterPopup = useSortAndFilterPopup(offerId)
  const cancelOffer = useCancelOffer(offerId)

  const goToEditPremium = useCallback(() => navigation.navigate('editPremium', { offerId }), [navigation, offerId])

  const memoizedHeaderIcons = useMemo(() => {
    if (!offer) return undefined
    const filterIcon = isBuyOffer(offer) ? headerIcons.buyFilter : headerIcons.sellFilter
    const icons = [{ ...filterIcon, onPress: showSortAndFilterPopup }]

    if (isSellOffer(offer)) icons.push({ ...headerIcons.percent, onPress: goToEditPremium })

    icons.push({ ...headerIcons.cancel, onPress: cancelOffer })

    if (offer.matches.length > 0) {
      icons.push({ ...headerIcons.help, onPress: isBuyOffer(offer) ? showMatchPopup : showAcceptMatchPopup })
    }
    return icons
  }, [offer, cancelOffer, goToEditPremium, showMatchPopup, showAcceptMatchPopup, showSortAndFilterPopup])

  return <Header title={offerIdToHex(offerId)} icons={memoizedHeaderIcons} />
}
