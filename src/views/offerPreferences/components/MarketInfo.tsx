import { View } from 'react-native'
import { MeansOfPayment } from '../../../../peach-api/src/@types/payment'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { Section } from './Section'
import { useFilteredMarketStats } from './useFilteredMarketStats'

export function MarketInfo ({
  type,
  ...preferences
}: {
  type: 'buyOffers' | 'sellOffers'
  meansOfPayment?: MeansOfPayment
  premium?: number
  maxPremium?: number
  minReputation?: number
  buyAmountRange?: [number, number]
  sellAmount?: number
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
      {type === 'sellOffers' && <AveragePremium averagePremium={averagePremium} offersWithinRange={offersWithinRange} />}
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
