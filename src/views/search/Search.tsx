import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { useCallback, useMemo } from 'react'
import { Header, Matches, PeachScrollView, Screen } from '../../components'
import { useCancelOffer, useNavigation, useRoute, useShowHelp } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { headerIcons } from '../../utils/layout'
import { isBuyOffer, isSellOffer, offerIdToHex } from '../../utils/offer'
import { MatchInformation, NoMatchesYet } from './components'
import { useSearchSetup } from './hooks'
import { useSortAndFilterPopup } from './hooks/useSortAndFilterPopup'

export const Search = () => {
  const { hasMatches, offer } = useSearchSetup()
  if (!offer) return <></>
  return (
    <Screen style={hasMatches && tw`px-0`} header={<SearchHeader />} showTradingLimit>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`} bounces={false}>
        <View style={tw`grow`}>
          {hasMatches && isSellOffer(offer) && <MatchInformation offer={offer} />}
          {!hasMatches && <NoMatchesYet offer={offer} />}
        </View>
        {hasMatches && <Matches />}
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
  const cancelOffer = useCancelOffer(offer)

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
