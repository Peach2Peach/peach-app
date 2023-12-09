import { LogoIcons } from '../../assets/logo'
import { Header, PeachScrollView, Screen, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { MarketInfo } from './components/MarketInfo'
import { Methods } from './components/Methods'
import { SectionContainer } from './components/SectionContainer'

export function BuyOfferPreferences () {
  return (
    <Screen header={<BuyHeader />}>
      <PeachScrollView>
        <MarketInfo type="sellOffers" />
        <Methods type="buy" />
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

function BuyHeader () {
  return (
    <Header
      titleComponent={
        <>
          <Text style={tw`h7 md:h6 text-success-main`}>{i18n('buy')}</Text>
          <LogoIcons.bitcoinText style={tw`h-14px md:h-16px w-63px md:w-71px`} />
        </>
      }
    />
  )
}
