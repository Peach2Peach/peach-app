import { PeachScrollView, Screen, Text } from '../../components'
import tw from '../../styles/tailwind'
import { MarketInfo } from './components/MarketInfo'
import { Methods } from './components/Methods'
import { SectionContainer } from './components/SectionContainer'

export function BuyOfferPreferences () {
  return (
    <Screen>
      <PeachScrollView>
        <MarketInfo type="sellOffers" />
        <Methods />
        <AmountSelector />
        <Filters />
      </PeachScrollView>
      <ShowOffersButton />
    </Screen>
  )
}

function AmountSelector () {
  return (
    <SectionContainer style={tw`bg-success-mild-1`}>
      <Text>AmountSelector</Text>
    </SectionContainer>
  )
}
function Filters () {
  return (
    <SectionContainer style={tw`bg-success-mild-1`}>
      <Text>Filters</Text>
    </SectionContainer>
  )
}
function ShowOffersButton () {
  return (
    <SectionContainer style={tw`bg-success-mild-1`}>
      <Text>ShowOffersButton</Text>
    </SectionContainer>
  )
}
