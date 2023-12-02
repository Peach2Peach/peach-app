import { View } from 'react-native'
import { Header, PeachScrollView, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import tw from '../../styles/tailwind'

export function SellOfferPreferences () {
  return (
    <Screen style={tw`bg-primary-background`} header={<Header title="Sell Bitcoin" />}>
      <PeachScrollView contentStyle={tw`gap-7`}>
        <MarketInfo />
        <PaymentMethods />
        <CompetingOfferStats />
        <AmountSelector />
        <FundMultipleOffers />
        <InstantTrade />
        <RefundWallet />
      </PeachScrollView>

      <SellAction />
    </Screen>
  )
}

function SellAction () {
  return (
    <>
      <FundWithPeachWallet />
      <FundEscrowButton />
    </>
  )
}

function MarketInfo ({ type = 'buyOffers' }: { type?: 'buyOffers' | 'sellOffers' }) {
  const textStyle = type === 'buyOffers' ? tw`text-success-main` : tw`text-primary-main`
  return (
    <SectionContainer style={tw`-gap-13px`}>
      <Text style={[tw`h5`, textStyle]}>x buy offers</Text>
      <Text style={[tw`subtitle-2`, textStyle]}>for your preferences</Text>
    </SectionContainer>
  )
}

function PaymentMethods () {
  return (
    <SectionContainer style={tw`bg-primary-background-dark`}>
      <Text>Payment Methods</Text>
    </SectionContainer>
  )
}

function CompetingOfferStats () {
  return (
    <SectionContainer>
      <Text>Competing Offer Stats</Text>
    </SectionContainer>
  )
}

function AmountSelector () {
  return (
    <SectionContainer style={tw`bg-primary-background-dark`}>
      <Text>Amount Selector</Text>
    </SectionContainer>
  )
}

function FundMultipleOffers () {
  return (
    <SectionContainer>
      <Text>Fund Multiple Offers</Text>
    </SectionContainer>
  )
}

function InstantTrade () {
  return (
    <SectionContainer style={tw`bg-primary-background-dark`}>
      <Text>Instant Trade</Text>
    </SectionContainer>
  )
}

function RefundWallet () {
  return (
    <SectionContainer style={tw`bg-primary-background-dark`}>
      <Text>Refund Wallet</Text>
    </SectionContainer>
  )
}

function FundWithPeachWallet () {
  return (
    <SectionContainer>
      <Text>Fund With Peach Wallet</Text>
    </SectionContainer>
  )
}

function FundEscrowButton () {
  const formValid = true
  return (
    <Button style={tw`self-center px-5 py-3 min-w-166px`} disabled={formValid}>
      Fund Escrow
    </Button>
  )
}

function SectionContainer ({ children, style }: { children: React.ReactNode; style?: View['props']['style'] }) {
  return <View style={[tw`items-center w-full p-2 rounded-2xl`, style]}>{children}</View>
}
