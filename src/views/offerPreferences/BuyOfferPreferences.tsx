import { useState } from 'react'
import { LogoIcons } from '../../assets/logo'
import { Header, PeachScrollView, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { MarketInfo } from './components/MarketInfo'
import { Methods } from './components/Methods'
import { SectionContainer } from './components/SectionContainer'

export function BuyOfferPreferences () {
  const [isSliding, setIsSliding] = useState(false)
  return (
    <Screen header={<BuyHeader />}>
      <PeachScrollView contentStyle={tw`gap-7`} scrollEnabled={!isSliding}>
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
  const formValid = true
  const isPublishing = false
  const onPress = () => {}
  return (
    <Button
      style={tw`self-center px-5 py-3 bg-success-main min-w-166px`}
      onPress={onPress}
      disabled={!formValid}
      loading={isPublishing}
    >
      Show Offers
    </Button>
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
