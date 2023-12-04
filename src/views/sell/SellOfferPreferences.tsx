import { useState } from 'react'
import { Animated, GestureResponderEvent, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { Header, Icon, PeachScrollView, Screen, Text, TouchableIcon } from '../../components'
import { Button } from '../../components/buttons/Button'
import { MeansOfPayment } from '../../components/offer/MeansOfPayment'
import { useBitcoinPrices, useIsMediumScreen, useMarketPrices, useNavigation } from '../../hooks'
import { useOfferPreferences } from '../../store/offerPreferenes'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getTradingAmountLimits } from '../../utils/market'
import { hasMopsConfigured } from '../../utils/offer'
import { FundMultipleOffers } from './components/FundMultipleOffers'

export function SellOfferPreferences () {
  const [isSliding, setIsSliding] = useState(false)
  const [amount, setAmount] = useState(0)
  return (
    <Screen style={tw`bg-primary-background`} header={<Header title="Sell Bitcoin" />}>
      <PeachScrollView contentStyle={tw`gap-7`} scrollEnabled={!isSliding}>
        <MarketInfo />
        <Methods />
        <CompetingOfferStats />
        <AmountSelector
          slider={<Slider setIsSliding={setIsSliding} setAmount={setAmount} />}
          inputs={
            <>
              <SatsInput amount={amount} />
              <FiatInput amount={amount} />
            </>
          }
        />
        <FundMultipleOffersContainer />
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

function AmountSelector ({ slider, inputs }: { slider?: JSX.Element; inputs?: JSX.Element }) {
  return (
    <SectionContainer style={tw`bg-primary-background-dark`}>
      <Text style={tw`subtitle-1`}>amount</Text>
      <View>
        <View style={tw`flex-row gap-10px`}>{inputs}</View>
        {slider}
      </View>
    </SectionContainer>
  )
}

function Slider ({
  setIsSliding,
  setAmount,
}: {
  setIsSliding: (isSliding: boolean) => void
  setAmount: (amount: number) => void
}) {
  const { width } = useWindowDimensions()
  const isMediumScreen = useIsMediumScreen()
  const sectionContainerPadding = 12
  const screenPadding = isMediumScreen ? 16 : 8
  const horizontalTrackPadding = 22
  const horizontalPaddingForSlider = 8
  const trackWidth = width - screenPadding - sectionContainerPadding - horizontalTrackPadding
  const iconWidth = 16
  const horizontalSliderPadding = 8
  const sliderWidth = iconWidth + horizontalSliderPadding * 2

  const [trackMin, trackMax] = [horizontalPaddingForSlider, trackWidth - sliderWidth - horizontalPaddingForSlider]

  const { data } = useMarketPrices()

  const amountRange = getTradingAmountLimits(data?.CHF || 0, 'sell')

  const sliderPosition = new Animated.Value(trackMin)
  const onDrag = (event: GestureResponderEvent) => {
    // calculate the new position
    const newPosition = event.nativeEvent.pageX - horizontalTrackPadding - screenPadding - sectionContainerPadding
    const boundedPosition = Math.max(trackMin, Math.min(trackMax, newPosition))
    sliderPosition.setValue(boundedPosition)
    // calculate the new amount
    const amountPosition = (boundedPosition - trackMin) / (trackMax - trackMin)
    const newAmount = Math.round(amountRange[0] + amountPosition * (amountRange[1] - amountRange[0]))
    setAmount(newAmount)
  }

  return (
    <View
      style={[
        tw`flex-row items-center justify-between py-3 border rounded-2xl border-primary-mild-2`,
        { width: trackWidth, paddingHorizontal: horizontalTrackPadding },
      ]}
    >
      <View style={tw`h-1 w-2px rounded-px bg-primary-mild-2`} />
      <View style={tw`h-1 w-2px rounded-px bg-primary-mild-2`} />
      <View style={tw`h-1 w-2px rounded-px bg-primary-mild-2`} />
      <View style={tw`h-1 w-2px rounded-px bg-primary-mild-2`} />
      <View style={tw`h-1 w-2px rounded-px bg-primary-mild-2`} />

      <Animated.View
        style={[
          tw`absolute items-center justify-center py-2px rounded-2xl bg-primary-main`,
          { transform: [{ translateX: sliderPosition }], paddingHorizontal: horizontalSliderPadding },
        ]}
        hitSlop={{ top: 0, bottom: 80, left: trackWidth, right: trackWidth }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onMoveShouldSetResponderCapture={() => true}
        onStartShouldSetResponderCapture={() => true}
        onResponderTerminationRequest={() => false}
        onResponderMove={onDrag}
        onTouchStart={() => setIsSliding(true)}
        onTouchEnd={() => setIsSliding(false)}
      >
        <Icon id="chevronsUp" size={iconWidth} color={tw.color('primary-background-light')} />
      </Animated.View>
    </View>
  )
}

const inputContainerStyle = [
  'items-center justify-center flex-1 bg-primary-background-light flex-row',
  'border rounded-lg border-black-4',
]
const textStyle = 'text-center subtitle-1 leading-relaxed py-1px'

function SatsInput ({ amount }: { amount: number }) {
  const updateValue = (value: string) => {}
  return (
    <View style={tw.style(inputContainerStyle)}>
      <TextInput style={tw.style(textStyle)} value={amount.toString()} onChangeText={updateValue} />
      <Text style={tw.style(textStyle)}> {i18n('currency.SATS')}</Text>
    </View>
  )
}

function FiatInput ({ amount }: { amount: number }) {
  const { displayCurrency, fiatPrice } = useBitcoinPrices(amount)
  const value = fiatPrice.toString()
  const updateValue = (value: string) => {}
  return (
    <View style={tw.style(inputContainerStyle)}>
      <TextInput style={tw.style(textStyle)} value={value} onChangeText={updateValue} />
      <Text style={tw.style(textStyle)}> {i18n(displayCurrency)}</Text>
    </View>
  )
}

function FundMultipleOffersContainer () {
  return (
    <SectionContainer style={tw`items-start`}>
      <FundMultipleOffers />
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
  return <View style={[tw`items-center w-full p-3 rounded-2xl gap-10px`, style]}>{children}</View>
}
