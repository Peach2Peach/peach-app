import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { Screen } from '../../components'
import { Match } from '../../components/matches/Match'
import { useMatchStore } from '../../components/matches/store'
import { useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { LoadingScreen } from '../loading/LoadingScreen'
import { useOfferMatches } from '../search/hooks'

export function MatchDetails () {
  const { matchId, offerId } = useRoute<'matchDetails'>().params
  const { allMatches } = useOfferMatches(offerId)
  const match = allMatches.find((e) => e.offerId === matchId)
  const { offer } = useOfferDetails(offerId)

  const [addMatchSelectors, resetStore] = useMatchStore((state) => [state.addMatchSelectors, state.resetStore], shallow)

  useEffect(() => {
    if (offer?.meansOfPayment) addMatchSelectors(allMatches, offer.meansOfPayment)
  }, [addMatchSelectors, allMatches, offer?.meansOfPayment])

  useEffect(
    () => () => {
      resetStore()
    },
    [resetStore],
  )
  if (!offer || !match) return <LoadingScreen />
  return (
    <Screen showTradingLimit>
      <Match match={match} offer={offer} />
    </Screen>
  )
}
