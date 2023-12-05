/* eslint-disable max-lines */
import { useCallback, useMemo, useRef, useState } from 'react'
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInput,
  TextInputEndEditingEventData,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native'
import { Checkbox, Header, Icon, PeachScrollView, Screen, Text, TouchableIcon } from '../../components'
import { BTCAmount } from '../../components/bitcoin'
import { Button } from '../../components/buttons/Button'
import { MeansOfPayment } from '../../components/offer/MeansOfPayment'
import { SATSINBTC } from '../../constants'
import { useBitcoinPrices, useIsMediumScreen, useMarketPrices, useNavigation, useToggleBoolean } from '../../hooks'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { convertFiatToSats, getTradingAmountLimits } from '../../utils/market'
import { round } from '../../utils/math'
import { hasMopsConfigured } from '../../utils/offer'
import { priceFormat } from '../../utils/string'
import { Slider } from './Slider'
import { SliderTrack } from './SliderTrack'
import { PremiumInput } from './components'
import { FundMultipleOffers } from './components/FundMultipleOffers'

export function SellOfferPreferences () {
  const [isSliding, setIsSliding] = useState(false)
  return (
    <Screen style={tw`bg-primary-background`} header={<Header title="Sell Bitcoin" />}>
      <PeachScrollView contentStyle={tw`gap-7`} scrollEnabled={!isSliding}>
        <MarketInfo />
        <Methods />
        <CompetingOfferStats />
        <AmountSelector setIsSliding={setIsSliding} />
        <FundMultipleOffersContainer />
        <InstantTrade />
        <RefundWallet />
      </PeachScrollView>

      <SellAction />
    </Screen>
  )
}

const sectionContainerPadding = 12
const horizontalTrackPadding = 22
function AmountSelector ({ setIsSliding }: { setIsSliding: (isSliding: boolean) => void }) {
  const { width } = useWindowDimensions()
  const isMediumScreen = useIsMediumScreen()
  const screenPadding = useMemo(() => (isMediumScreen ? 16 : 8), [isMediumScreen])
  const trackWidth = useMemo(
    () => width - screenPadding - sectionContainerPadding - horizontalTrackPadding,
    [screenPadding, width],
  )

  return (
    <AmountSelectorContainer
      slider={
        <SliderTrack
          slider={<SellAmountSlider setIsSliding={setIsSliding} trackWidth={trackWidth} />}
          trackWidth={trackWidth}
          paddingHorizontal={horizontalTrackPadding}
        />
      }
      inputs={
        <>
          <SatsInput />
          <FiatInput />
        </>
      }
    />
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

function AmountSelectorContainer ({ slider, inputs }: { slider?: JSX.Element; inputs?: JSX.Element }) {
  return (
    <SectionContainer style={tw`bg-primary-background-dark`}>
      <Text style={tw`subtitle-1`}>amount</Text>
      <View style={tw`gap-2`}>
        <View style={tw`flex-row gap-10px`}>{inputs}</View>
        {slider}
      </View>
      <Premium />
    </SectionContainer>
  )
}

const replaceAllCommasWithDots = (value: string) => value.replace(/,/gu, '.')
const removeAllButOneDot = (value: string) => value.replace(/\.(?=.*\.)/gu, '')
function Premium () {
  const [premium, setPremium] = useOfferPreferences((state) => [state.premium, state.setPremium])

  const displayCurrency = useSettingsStore((state) => state.displayCurrency)
  const amount = useOfferPreferences((state) => state.sellAmount)
  const { fiatPrice } = useBitcoinPrices(amount)
  const priceWithPremium = round(fiatPrice * (1 + premium / 100), 2)

  return (
    <View style={tw`items-center justify-between gap-10px`}>
      <View style={tw`px-4 pb-1 border-b-2 border-black-1`}>
        <Text style={tw`subtitle-1`}>premium</Text>
      </View>
      <View style={tw`items-center gap-1`}>
        <PremiumInput premium={premium} setPremium={setPremium} />
        <Text style={tw`text-center body-s`}>
          currently {priceWithPremium} {displayCurrency}
        </Text>
        <Text style={tw`text-center body-s text-primary-dark-2`}>x competing sell offers below this premium</Text>
      </View>
    </View>
  )
}

const horizontalPaddingForSlider = 8
export const iconWidth = 16
export const horizontalSliderPadding = 8
const sliderWidth = iconWidth + horizontalSliderPadding * 2
const trackMin = horizontalPaddingForSlider
// TODO: Why is this value 40? makes sense, but maybe theres a better way to calculate it
export const sliderBottomHitSlop = 40

type SellAmountSliderProps = {
  trackWidth: number
  setIsSliding: (isSliding: boolean) => void
}

function SellAmountSlider ({ trackWidth, setIsSliding }: SellAmountSliderProps) {
  const { data } = useMarketPrices()
  const amountRange = getTradingAmountLimits(data?.CHF || 0, 'sell')

  const [amount, setAmount] = useOfferPreferences((state) => [state.sellAmount, state.setSellAmount])
  const isMediumScreen = useIsMediumScreen()
  const screenPadding = useMemo(() => (isMediumScreen ? 16 : 8), [isMediumScreen])

  const trackMax = useMemo(() => trackWidth - sliderWidth - horizontalPaddingForSlider, [trackWidth])

  const onDrag = ({ nativeEvent: { pageX } }: GestureResponderEvent) => {
    const newPosition = pageX - horizontalTrackPadding - screenPadding - sectionContainerPadding
    const boundedPosition = Math.max(trackMin, Math.min(trackMax, newPosition))
    const amountPercentage = (boundedPosition - trackMin) / (trackMax - trackMin)
    const newAmount = Math.round(amountRange[0] + amountPercentage * (amountRange[1] - amountRange[0]))
    setAmount(newAmount)
  }

  return (
    <Slider
      trackWidth={trackWidth}
      setIsSliding={setIsSliding}
      onDrag={onDrag}
      transform={[{ translateX: (amount / amountRange[1]) * (trackMax - trackMin) }]}
    />
  )
}

const inputContainerStyle = [
  'items-center justify-center flex-1 bg-primary-background-light flex-row',
  'border rounded-lg border-black-4',
]
const textStyle = 'text-center subtitle-1 leading-relaxed py-1px'

const useRestrictSatsAmount = () => {
  const { data } = useMarketPrices()
  const [minSellAmount, maxSellAmount] = useMemo(() => getTradingAmountLimits(data?.CHF || 0, 'sell'), [data?.CHF])

  const restrictAmount = useCallback(
    (amount: number) => {
      if (amount < minSellAmount) {
        return minSellAmount
      } else if (amount > maxSellAmount) {
        return maxSellAmount
      }
      return amount
    },
    [minSellAmount, maxSellAmount],
  )
  return restrictAmount
}

const enforceDigitFormat = (value: string) => value.replace(/[^0-9]/gu, '')
function SatsInput () {
  const [amount, setAmount] = useOfferPreferences((state) => [state.sellAmount, state.setSellAmount])
  const inputRef = useRef<TextInput>(null)
  const [inputValue, setInputValue] = useState(amount.toString())
  const restrictAmount = useRestrictSatsAmount()

  const onFocus = () => setInputValue(amount.toString())

  const onChangeText = (value: string) => setInputValue(enforceDigitFormat(value))

  const onEndEditing = ({ nativeEvent: { text } }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const newAmount = restrictAmount(Number(enforceDigitFormat(text)))
    setAmount(newAmount)
    setInputValue(newAmount.toString())
  }

  const displayValue = inputRef.current?.isFocused() ? inputValue : amount.toString()

  return (
    <View style={tw.style(inputContainerStyle)}>
      <BTCAmount size="small" amount={Number(displayValue)} />
      <TextInput
        style={[tw.style(textStyle), tw`absolute w-full opacity-0`]}
        ref={inputRef}
        value={displayValue}
        onFocus={onFocus}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
        keyboardType="number-pad"
      />
    </View>
  )
}

function FiatInput () {
  const [amount, setAmount] = useOfferPreferences((state) => [state.sellAmount, state.setSellAmount])
  const inputRef = useRef<TextInput>(null)

  const { displayCurrency, bitcoinPrice, fiatPrice } = useBitcoinPrices(amount)
  const [inputValue, setInputValue] = useState(fiatPrice.toString())

  const restrictAmount = useRestrictSatsAmount()

  const onFocus = () => {
    setInputValue(fiatPrice.toString())
  }

  const onChangeText = (value: string) => {
    value = removeAllButOneDot(replaceAllCommasWithDots(value))
    value = value.replace(/[^0-9.]/gu, '')
    setInputValue(value)
  }

  const onEndEditing = ({ nativeEvent: { text } }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const newFiatValue = Number(text)
    const newSatsAmount = restrictAmount(convertFiatToSats(newFiatValue, bitcoinPrice))
    setAmount(newSatsAmount)
    const restrictedFiatValue = priceFormat((newSatsAmount / SATSINBTC) * bitcoinPrice)
    setInputValue(restrictedFiatValue)
  }

  const displayValue = inputRef.current?.isFocused() ? inputValue : priceFormat(fiatPrice)
  return (
    <View style={tw.style(inputContainerStyle)}>
      <TextInput
        style={tw.style(textStyle)}
        ref={inputRef}
        value={displayValue}
        onFocus={onFocus}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
        keyboardType="decimal-pad"
      />
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
  const [showCriteria, toggle] = useToggleBoolean()
  const [criteria, setCriteria] = useState([])
  const onCheckboxPress = (criteria: 'reputation' | 'supertrader' | 'fast' | 'new') => {
    setCriteria((current) => {
      if (current.includes(criteria)) {
        return current.filter((c) => c !== criteria)
      }
      return [...current, criteria]
    })
  }

  return (
    <SectionContainer style={tw`bg-primary-background-dark`}>
      <View style={tw`flex-row items-center self-stretch justify-between`}>
        <TouchableIcon
          id={showCriteria ? 'chevronUp' : 'chevronDown'}
          onPress={toggle}
          iconColor={tw.color('black-1')}
        />
        <Text style={tw`subtitle-1`}>instant - trade with:</Text>
        <TouchableIcon id="helpCircle" iconColor={tw.color('info-main')} />
      </View>
      {showCriteria && (
        <View style={tw`self-stretch`}>
          <Checkbox
            checked={criteria.includes('reputation')}
            text="reputation over 4.5"
            onPress={() => onCheckboxPress('reputation')}
          />
          <Checkbox
            checked={criteria.includes('supertrader')}
            text="supertrader"
            onPress={() => onCheckboxPress('supertrader')}
          />
          <Checkbox checked={criteria.includes('fast')} text="fast trader" onPress={() => onCheckboxPress('fast')} />
          <Checkbox checked={criteria.includes('new')} text="no new users" onPress={() => onCheckboxPress('new')} />
        </View>
      )}
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
  const { data } = useMarketPrices()
  const amountRange = getTradingAmountLimits(data?.CHF || 0, 'sell')
  const { premium } = useOfferPreferences((state) => state.canContinue)
  const sellAmount = useOfferPreferences((state) => state.sellAmount)

  const sellAmountIsValid = sellAmount >= amountRange[0] && sellAmount <= amountRange[1]
  const formValid = sellAmountIsValid && premium
  return (
    <Button style={tw`self-center px-5 py-3 min-w-166px`} disabled={!formValid}>
      Fund Escrow
    </Button>
  )
}

function SectionContainer ({ children, style }: { children: React.ReactNode; style?: View['props']['style'] }) {
  return <View style={[tw`items-center w-full p-3 rounded-2xl gap-10px`, style]}>{children}</View>
}
