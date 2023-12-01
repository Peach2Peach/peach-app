import { View } from 'react-native'
import { Header, PeachScrollView, Screen, Text } from '../../components'
import tw from '../../styles/tailwind'

export function SellOfferPreferences () {
  return (
    <Screen style={tw`bg-primary-background`} header={<Header title="Sell Bitcoin" />}>
      <PeachScrollView contentContainerStyle={tw`gap-7`}>
        <OpenOffers />
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

function OpenOffers () {
  return (
    <View style={tw`w-full h-10 border`}>
      <Text>Open Offers</Text>
    </View>
  )
}

function PaymentMethods () {
  return (
    <View style={tw`w-full h-10 border bg-primary-background-dark`}>
      <Text>Payment Methods</Text>
    </View>
  )
}

function CompetingOfferStats () {
  return (
    <View style={tw`w-full h-10 border`}>
      <Text>Competing Offer Stats</Text>
    </View>
  )
}

function AmountSelector () {
  return (
    <View style={tw`w-full h-10 border bg-primary-background-dark`}>
      <Text>Amount Selector</Text>
    </View>
  )
}

function FundMultipleOffers () {
  return (
    <View style={tw`w-full h-10 border`}>
      <Text>Fund Multiple Offers</Text>
    </View>
  )
}

function InstantTrade () {
  return (
    <View style={tw`w-full h-10 border bg-primary-background-dark`}>
      <Text>Instant Trade</Text>
    </View>
  )
}

function RefundWallet () {
  return (
    <View style={tw`w-full h-10 border bg-primary-background-dark`}>
      <Text>Refund Wallet</Text>
    </View>
  )
}

function FundWithPeachWallet () {
  return (
    <View style={tw`w-full h-10 border`}>
      <Text>Fund With Peach Wallet</Text>
    </View>
  )
}

function FundEscrowButton () {
  return (
    <View style={tw`w-full h-10 border`}>
      <Text>Fund Escrow Button</Text>
    </View>
  )
}
