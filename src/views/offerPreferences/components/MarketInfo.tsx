import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { View } from 'react-native'
import { MeansOfPayment } from '../../../../peach-api/src/@types/payment'
import { Text } from '../../../components'
import { MSINAMINUTE } from '../../../constants'
import tw from '../../../styles/tailwind'
import { peachAPI } from '../../../utils/peachAPI'
import { isDefined } from '../../../utils/validation/isDefined'
import { Section } from './Section'

export function MarketInfo ({
  type,
  ...preferences
}: {
  type: 'buyOffers' | 'sellOffers'
  meansOfPayment?: MeansOfPayment
  maxPremium?: number
  minReputation?: number
  buyAmountRange?: [number, number]
}) {
  const text = type === 'buyOffers' ? 'buy offers' : 'sell offers'
  const textStyle = type === 'buyOffers' ? tw`text-success-main` : tw`text-primary-main`

  const {
    data: { offersWithinRange, averagePremium },
  } = useFilteredMarketStats({ type: type === 'buyOffers' ? 'bid' : 'ask', ...preferences })

  return (
    <Section.Container style={tw`gap-0`}>
      <View style={tw`items-center`}>
        <View style={tw`-gap-13px`}>
          <Text style={[tw`h5`, textStyle]}>
            {offersWithinRange.length} {text}
          </Text>
          <Text style={[tw`subtitle-2`, textStyle]}>for your preferences</Text>
        </View>
      </View>
      <AveragePremium averagePremium={averagePremium} offersWithinRange={offersWithinRange} />
    </Section.Container>
  )
}

function AveragePremium ({
  averagePremium,
  offersWithinRange,
}: {
  averagePremium: number
  offersWithinRange: (Pick<SellOffer, 'premium' | 'amount'> | Pick<BuyOffer, 'amount'>)[]
}) {
  return (
    <Text style={[tw`body-s text-primary-main`, offersWithinRange.length === 0 && tw`opacity-0`]}>
      average premium: {averagePremium}%
    </Text>
  )
}

function useFilteredMarketStats ({
  type,
  meansOfPayment,
  maxPremium,
  minReputation,
  buyAmountRange,
}: {
  type: 'bid' | 'ask'
  meansOfPayment?: MeansOfPayment
  maxPremium?: number
  minReputation?: number
  buyAmountRange?: [number, number]
}) {
  const queryData = useQuery({
    queryKey: ['offer', 'search', 'summary', { type, meansOfPayment, maxPremium, minReputation }] as const,
    queryFn: async ({ queryKey }) => {
      const [, , , requestBody] = queryKey
      const { result } = await peachAPI.private.offer.searchOfferSummaries(requestBody)
      return result
    },
    keepPreviousData: true,
    staleTime: MSINAMINUTE,
  })

  const offersWithinRange = useMemo(() => {
    if (!buyAmountRange || !queryData.data?.offers) return []
    const [min, max] = buyAmountRange
    return queryData.data.offers.filter(
      (offer) => 'amount' in offer && typeof offer.amount === 'number' && offer.amount >= min && offer.amount <= max,
    )
  }, [buyAmountRange, queryData.data?.offers])

  const averagePremium = useMemo(() => {
    const premiums = offersWithinRange.map((offer) => ('premium' in offer ? offer.premium : undefined)).filter(isDefined)
    const avg = premiums.reduce((a, b) => a + b, 0) / premiums.length
    return avg
  }, [offersWithinRange])

  return { ...queryData, data: { ...queryData.data, offersWithinRange, averagePremium } }
}
