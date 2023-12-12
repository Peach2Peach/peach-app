import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { Screen } from '../../components'
import { Match } from '../../components/matches/Match'
import { useMatchStore } from '../../components/matches/store'
import { useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { peachAPI } from '../../utils/peachAPI'
import { LoadingScreen } from '../loading/LoadingScreen'

export function MatchDetails () {
  const { matchId, offerId } = useRoute<'matchDetails'>().params

  const { data: match } = useMatchDetails({ offerId, matchId })
  const { offer } = useOfferDetails(offerId)

  const [addMatchSelectors, resetStore] = useMatchStore((state) => [state.addMatchSelectors, state.resetStore], shallow)

  useEffect(() => {
    if (offer?.meansOfPayment) addMatchSelectors(match ? [match] : [], offer.meansOfPayment)
  }, [addMatchSelectors, match, offer?.meansOfPayment])

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

function useMatchDetails ({ offerId, matchId }: { offerId: string; matchId: string }) {
  return useQuery({
    queryKey: ['matchDetails', offerId, matchId],
    queryFn: async () => {
      const { result } = await peachAPI.private.offer.getMatch({ offerId, matchId })

      if (!result) throw new Error('Match not found')
      return result
    },
  })
}
