import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { Section } from './Section'

export function MarketInfo ({ type }: { type: 'buyOffers' | 'sellOffers' }) {
  const text = type === 'buyOffers' ? 'buy offers' : 'sell offers'
  const textStyle = type === 'buyOffers' ? tw`text-success-main` : tw`text-primary-main`
  const openOffers = 0
  return (
    <Section.Container style={tw`gap-0`}>
      <View style={tw`-gap-13px`}>
        <Text style={[tw`h5`, textStyle]}>
          {openOffers} {text}
        </Text>
        <Text style={[tw`subtitle-2`, textStyle]}>for your preferences</Text>
      </View>
      {type === 'sellOffers' && <AveragePremium />}
    </Section.Container>
  )
}

function AveragePremium () {
  const premium = 5
  return <Text style={tw`body-s text-primary-main`}>average premium: ~{premium}%</Text>
}
