import { TouchableOpacity, View } from 'react-native'
import { Header, Icon, PeachScrollView, Screen, Text, TouchableIcon } from '../../components'
import { Button } from '../../components/buttons/Button'
import { MeansOfPayment } from '../../components/offer/MeansOfPayment'
import { useNavigation } from '../../hooks'
import { useOfferPreferences } from '../../store/offerPreferenes'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { hasMopsConfigured } from '../../utils/offer'

export function SellOfferPreferences () {
  return (
    <Screen style={tw`bg-primary-background`} header={<Header title="Sell Bitcoin" />}>
      <PeachScrollView contentStyle={tw`gap-7`}>
        <MarketInfo />
        <Methods />
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
  const openOffers = 0
  return (
    <SectionContainer style={tw`-gap-13px`}>
      <Text style={[tw`h5`, textStyle]}>{openOffers} buy offers</Text>
      <Text style={[tw`subtitle-2`, textStyle]}>for your preferences</Text>
    </SectionContainer>
  )
}

function Methods () {
  const navigation = useNavigation()
  const onPress = () => navigation.navigate('paymentMethods')
  const meansOfPayment = useOfferPreferences((state) => state.meansOfPayment)
  const hasSelectedMethods = hasMopsConfigured(meansOfPayment)

  return (
    <>
      {hasSelectedMethods ? (
        <SectionContainer style={tw`flex-row items-start bg-primary-background-dark`}>
          <MeansOfPayment meansOfPayment={meansOfPayment} />
          <TouchableIcon id="plusCircle" onPress={onPress} style={tw`pt-1`} />
        </SectionContainer>
      ) : (
        <SectionContainer style={tw`bg-primary-background-dark`}>
          <TouchableOpacity style={tw`flex-row items-center gap-10px`} onPress={onPress}>
            <Icon size={16} id="plusCircle" color={tw.color('primary-main')} />
            <Text style={tw`subtitle-2 text-primary-main`}>{i18n.break('paymentMethod.select.button.remote')}</Text>
          </TouchableOpacity>
        </SectionContainer>
      )}
    </>
  )
}

function CompetingOfferStats () {
  const textStyle = tw`text-center text-primary-dark-2 body-s`
  const competingSellOffers = 0
  const averageTradingPremium = 9
  return (
    <SectionContainer>
      <Text style={textStyle}>{competingSellOffers} competing sell offers</Text>
      <Text style={textStyle}>premium of completed offers: ~{averageTradingPremium}%</Text>
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
  return <View style={[tw`items-center w-full p-2 rounded-2xl gap-10px`, style]}>{children}</View>
}
