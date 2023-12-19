import { useCallback, useMemo } from 'react'
import { View } from 'react-native'
import { Header } from '../../components/Header'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Screen } from '../../components/Screen'
import { Matches } from '../../components/matches/Matches'
import { SellOfferSummary } from '../../components/offer/SellOfferSummary'
import { WalletLabel } from '../../components/offer/WalletLabel'
import { PeachText } from '../../components/text/PeachText'
import { useNavigation, useRoute, useShowHelp } from '../../hooks'
import { useCancelOffer } from '../../hooks/useCancelOffer'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { isBuyOffer } from '../../utils/offer/isBuyOffer'
import { isSellOffer } from '../../utils/offer/isSellOffer'
import { offerIdToHex } from '../../utils/offer/offerIdToHex'
import { LoadingScreen } from '../loading/LoadingScreen'
import { useOfferMatches, useSearchSetup } from './hooks'
import { useSortAndFilterPopup } from './hooks/useSortAndFilterPopup'

export const Search = () => {
  const { hasMatches, offer } = useSearchSetup()
  if (!offer || !isSellOffer(offer)) return <LoadingScreen />
  return (
    <Screen style={hasMatches && tw`px-0`} header={<SearchHeader offer={offer} />} showTradingLimit>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`} bounces={false}>
        {hasMatches ? <Matches offer={offer} /> : <NoMatchesYet offer={offer} />}
      </PeachScrollView>
    </Screen>
  )
}

function NoMatchesYet ({ offer }: { offer: SellOffer }) {
  const { isLoading } = useOfferMatches(offer.id)
  if (isLoading) return <></>
  return (
    <View style={tw`gap-8`}>
      <PeachText style={tw`text-center subtitle-1`}>{i18n('search.weWillNotifyYou')}</PeachText>

      <SellOfferSummary
        offer={offer}
        walletLabel={<WalletLabel label={offer.walletLabel} address={offer.returnAddress} />}
      />
    </View>
  )
}

function SearchHeader ({ offer }: { offer: SellOffer }) {
  const { offerId } = useRoute<'search'>().params
  const navigation = useNavigation()
  const showMatchPopup = useShowHelp('matchmatchmatch')
  const showAcceptMatchPopup = useShowHelp('acceptMatch')
  const showSortAndFilterPopup = useSortAndFilterPopup(offerId)
  const cancelOffer = useCancelOffer(offerId)

  const goToEditPremium = useCallback(() => navigation.navigate('editPremium', { offerId }), [navigation, offerId])

  const memoizedHeaderIcons = useMemo(() => {
    if (!offer) return undefined
    const icons = [
      { ...headerIcons.sellFilter, onPress: showSortAndFilterPopup },
      { ...headerIcons.percent, onPress: goToEditPremium },
      { ...headerIcons.cancel, onPress: cancelOffer },
    ]

    if (offer.matches.length > 0) {
      icons.push({ ...headerIcons.help, onPress: isBuyOffer(offer) ? showMatchPopup : showAcceptMatchPopup })
    }
    return icons
  }, [offer, cancelOffer, goToEditPremium, showMatchPopup, showAcceptMatchPopup, showSortAndFilterPopup])

  return <Header title={offerIdToHex(offerId)} icons={memoizedHeaderIcons} />
}
