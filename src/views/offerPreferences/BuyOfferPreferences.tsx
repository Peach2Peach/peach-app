import { useMemo, useRef, useState } from 'react'
import { NativeSyntheticEvent, TextInput, TextInputEndEditingEventData, View, useWindowDimensions } from 'react-native'
import { shallow } from 'zustand/shallow'
import { LogoIcons } from '../../assets/logo'
import { Checkbox, Header, PeachScrollView, Screen, Text, TouchableIcon } from '../../components'
import { premiumBounds } from '../../components/PremiumInput'
import { PremiumTextInput } from '../../components/PremiumTextInput'
import { Button } from '../../components/buttons/Button'
import { useBitcoinPrices, useIsMediumScreen } from '../../hooks'
import { useOfferPreferences } from '../../store/offerPreferenes'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { round } from '../../utils/math'
import { SatsInputComponent } from './SatsInputComponent'
import { MarketInfo } from './components/MarketInfo'
import { Methods } from './components/Methods'
import { Section } from './components/Section'
import { SliderTrack } from './components/SliderTrack'
import { enforceDigitFormat } from './enforceDigitFormat'
import { useRestrictSatsAmount } from './useRestrictSatsAmount'

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

const sectionContainerPadding = 12
const horizontalTrackPadding = 22
function AmountSelector () {
  const { width } = useWindowDimensions()
  const isMediumScreen = useIsMediumScreen()
  const screenPadding = useMemo(() => (isMediumScreen ? 16 : 8), [isMediumScreen])
  const trackWidth = useMemo(
    () => width - screenPadding - sectionContainerPadding - horizontalTrackPadding,
    [screenPadding, width],
  )

  return (
    <Section.Container style={tw`bg-success-mild-1`}>
      <Section.Title>amount to buy</Section.Title>
      <View style={tw`flex-row items-center self-stretch gap-10px`}>
        <MinInput />
        <Text style={tw`subtitle-1`}>-</Text>
        <MaxInput />
      </View>
      <SliderTrack slider={<></>} trackWidth={trackWidth} paddingHorizontal={horizontalTrackPadding} type="buy" />
    </Section.Container>
  )
}

function MinInput () {
  const inputRef = useRef<TextInput>(null)
  const [[amount, max], setAmountRange] = useOfferPreferences(
    (state) => [state.buyAmountRange, state.setBuyAmountRange],
    shallow,
  )
  const [inputValue, setInputValue] = useState(amount.toString())
  const restrictAmount = useRestrictSatsAmount('buy')

  const onFocus = () => setInputValue(amount.toString())

  const onChangeText = (value: string) => setInputValue(enforceDigitFormat(value))

  const onEndEditing = ({ nativeEvent: { text } }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const newAmount = restrictAmount(Number(enforceDigitFormat(text)))
    setAmountRange([newAmount, max])
    setInputValue(newAmount.toString())
  }

  const displayValue = inputRef.current?.isFocused() ? inputValue : amount.toString()

  const { fiatPrice, displayCurrency } = useBitcoinPrices(amount)

  return (
    <View style={tw`justify-center grow`}>
      <SatsInputComponent
        ref={inputRef}
        value={displayValue}
        onFocus={onFocus}
        onEndEditing={onEndEditing}
        onChangeText={onChangeText}
      />
      <Text style={tw`self-center text-black-3 body-s`}>
        {fiatPrice} {displayCurrency}
      </Text>
    </View>
  )
}

function MaxInput () {
  const inputRef = useRef<TextInput>(null)
  const [[min, amount], setAmountRange] = useOfferPreferences(
    (state) => [state.buyAmountRange, state.setBuyAmountRange],
    shallow,
  )
  const [inputValue, setInputValue] = useState(amount.toString())
  const restrictAmount = useRestrictSatsAmount('buy')

  const onFocus = () => setInputValue(amount.toString())

  const onChangeText = (value: string) => setInputValue(enforceDigitFormat(value))

  const onEndEditing = ({ nativeEvent: { text } }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const newAmount = restrictAmount(Number(enforceDigitFormat(text)))
    setAmountRange([min, newAmount])
    setInputValue(newAmount.toString())
  }

  const displayValue = inputRef.current?.isFocused() ? inputValue : amount.toString()

  const { fiatPrice, displayCurrency } = useBitcoinPrices(amount)

  return (
    <View style={tw`justify-center grow`}>
      <SatsInputComponent
        ref={inputRef}
        value={displayValue}
        onFocus={onFocus}
        onEndEditing={onEndEditing}
        onChangeText={onChangeText}
      />
      <Text style={tw`self-center text-black-3 body-s`}>
        {fiatPrice} {displayCurrency}
      </Text>
    </View>
  )
}

function Filters () {
  return (
    <Section.Container style={tw`bg-success-mild-1`}>
      <Section.Title>filters</Section.Title>
      <View style={tw`items-center self-stretch gap-10px`}>
        <MaxPremiumFilter />
        <MinReputationFilter />
      </View>
    </Section.Container>
  )
}

function MinReputationFilter () {
  const [minReputation, toggle] = useOfferPreferences(
    (state) => [state.filter.buyOffer.minReputation, state.toggleMinReputationFilter],
    shallow,
  )
  const checked = minReputation === 4.5
  return <Checkbox green checked={checked} onPress={toggle} text="minimum reputation: 4.5" style={tw`self-stretch`} />
}

const defaultMaxPremium = 0
function MaxPremiumFilter () {
  const [maxPremium, setMaxPremium] = useOfferPreferences(
    (state) => [state.filter.buyOffer.maxPremium, state.setMaxPremiumFilter],
    shallow,
  )
  const [shouldApplyFilter, toggle] = useOfferPreferences(
    (state) => [state.filter.buyOffer.shouldApplyMaxPremium, state.toggleShouldApplyMaxPremium],
    shallow,
  )

  const onCheckboxPress = () => {
    toggle()
    if (maxPremium === null) {
      setMaxPremium(defaultMaxPremium)
    }
  }
  const onPlusCirclePress = () => {
    setMaxPremium(Math.min(round((maxPremium || defaultMaxPremium) + 1, 2), premiumBounds.max))
  }

  const onMinusCirclePress = () => {
    setMaxPremium(Math.max(round((maxPremium || defaultMaxPremium) - 1, 2), premiumBounds.min))
  }

  const iconColor = tw.color('success-main')

  return (
    <View style={tw`flex-row items-center self-stretch justify-between`}>
      <Checkbox green checked={shouldApplyFilter} onPress={onCheckboxPress} text="max premium" />
      <View style={tw`flex-row items-center gap-10px`}>
        <TouchableIcon id="minusCircle" iconColor={iconColor} onPress={onMinusCirclePress} />
        <PremiumTextInput premium={maxPremium || defaultMaxPremium} setPremium={setMaxPremium} />
        <TouchableIcon id="plusCircle" iconColor={iconColor} onPress={onPlusCirclePress} />
      </View>
    </View>
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
