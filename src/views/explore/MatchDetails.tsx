import { Screen } from '../../components'
import { Match } from '../../components/matches/Match'
import { useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { LoadingScreen } from '../loading/LoadingScreen'
import { useOfferMatches } from '../search/hooks'

export function MatchDetails () {
  const { matchId, offerId } = useRoute<'matchDetails'>().params
  const { allMatches } = useOfferMatches(offerId)
  const match = allMatches.find((e) => e.offerId === matchId)
  const { offer } = useOfferDetails(offerId)
  if (!offer || !match) return <LoadingScreen />
  return (
    <Screen>
      <Match match={match} offer={offer} />
    </Screen>
  )
}
