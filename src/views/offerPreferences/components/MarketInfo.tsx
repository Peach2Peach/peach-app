import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { SectionContainer } from './SectionContainer'

export function MarketInfo ({ type = 'buyOffers' }: { type?: 'buyOffers' | 'sellOffers' }) {
  const textStyle = type === 'buyOffers' ? tw`text-success-main` : tw`text-primary-main`
  const openOffers = 0
  return (
    <SectionContainer style={tw`-gap-13px`}>
      <Text style={[tw`h5`, textStyle]}>{openOffers} buy offers</Text>
      <Text style={[tw`subtitle-2`, textStyle]}>for your preferences</Text>
    </SectionContainer>
  )
}
