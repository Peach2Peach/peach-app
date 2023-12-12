/* eslint-disable max-lines */
import { useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { GestureResponderEvent, NativeSyntheticEvent, TextInput, TextInputEndEditingEventData, View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Checkbox, PeachScrollView, Screen, Text, TouchableIcon } from '../../components'
import { premiumBounds } from '../../components/PremiumInput'
import { PremiumTextInput } from '../../components/PremiumTextInput'
import { Button } from '../../components/buttons/Button'
import { useBitcoinPrices, useMarketPrices, useNavigation, useRoute } from '../../hooks'
import { usePatchOffer } from '../../hooks/offer'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getTradingAmountLimits } from '../../utils/market'
import { round } from '../../utils/math'
import { isValidPaymentData } from '../../utils/paymentMethod'
import { matchesKeys } from '../search/hooks/useOfferMatches'
import { BuyBitcoinHeader } from './BuyBitcoinHeader'
import { SatsInputComponent } from './SatsInputComponent'
import { MarketInfo } from './components/MarketInfo'
import { Methods } from './components/Methods'
import { Section, sectionContainerGap } from './components/Section'
import { Slider, sliderWidth } from './components/Slider'
import { SliderTrack } from './components/SliderTrack'
import { trackMin } from './constants'
import { enforceDigitFormat } from './enforceDigitFormat'
import { useAmountInBounds } from './useAmountInBounds'
import { useRestrictSatsAmount } from './useRestrictSatsAmount'
import { useTrackWidth } from './useTrackWidth'
import { usePublishOffer } from './utils/usePublishOffer'

export function BuyOfferPreferences () {
  const [isSliding, setIsSliding] = useState(false)
  return (
    <Screen header={<BuyBitcoinHeader />}>
      <PeachScrollView contentStyle={tw`gap-7`} scrollEnabled={!isSliding}>
        <MarketInfo type="sellOffers" />
        <Methods type="buy" />
        <AmountSelector setIsSliding={setIsSliding} />
        <Filters />
      </PeachScrollView>

      <ShowOffersButton />
    </Screen>
  )
}

const useMinSliderDeltaAsAmount = (trackWidth: number) => {
  const { data } = useMarketPrices()
  const [minLimit, maxLimit] = getTradingAmountLimits(data?.CHF || 0, 'buy')

  const trackDelta = trackWidth - sliderWidth - trackMin
  const minSliderDeltaAsAmount = (sliderWidth / trackDelta) * (maxLimit - minLimit)
  return minSliderDeltaAsAmount
}

function AmountSelector ({ setIsSliding }: { setIsSliding: (isSliding: boolean) => void }) {
  const trackWidth = useTrackWidth()
  const minSliderDeltaAsAmount = useMinSliderDeltaAsAmount(trackWidth)

  return (
    <Section.Container style={tw`bg-success-mild-1`}>
      <Section.Title>amount to buy</Section.Title>
      <View style={tw`flex-row items-center self-stretch gap-10px`}>
        <BuyAmountInput type="min" minAmountDelta={minSliderDeltaAsAmount} />
        <Text style={tw`subtitle-1`}>-</Text>
        <BuyAmountInput type="max" minAmountDelta={minSliderDeltaAsAmount} />
      </View>
      <SliderTrack
        slider={<BuyAmountSliders setIsSliding={setIsSliding} trackWidth={trackWidth} />}
        trackWidth={trackWidth}
        type="buy"
      />
    </Section.Container>
  )
}

type BuyAmountSliderProps = {
  setIsSliding: (isSliding: boolean) => void
  trackWidth: number
}

function BuyAmountSliders ({ setIsSliding, trackWidth }: BuyAmountSliderProps) {
  const { data } = useMarketPrices()
  const [, maxLimit] = getTradingAmountLimits(data?.CHF || 0, 'buy')

  const trackMax = trackWidth - sliderWidth
  const trackDelta = trackMax - trackMin

  const getAmountInBounds = useAmountInBounds(trackWidth, 'buy')

  const [[min, max], setAmountRange] = useOfferPreferences(
    (state) => [state.buyAmountRange, state.setBuyAmountRange],
    shallow,
  )
  const maxTranslateX = (max / maxLimit) * trackDelta
  const minTranslateX = (min / maxLimit) * trackDelta

  const sliderDelta = maxTranslateX - minTranslateX
  const minSliderDeltaAsAmount = useMinSliderDeltaAsAmount(trackWidth)
  const onDrag
    = (type: 'min' | 'max') =>
      ({ nativeEvent: { pageX } }: GestureResponderEvent) => {
        const bounds
        = type === 'min' ? ([trackMin, trackMax - sliderWidth] as const) : ([trackMin + sliderWidth, trackMax] as const)
        const newAmount = getAmountInBounds(pageX, bounds)

        if (type === 'min') {
          const newMaxAmount = Math.max(newAmount + minSliderDeltaAsAmount, max)
          setAmountRange([newAmount, newMaxAmount])
        } else {
          const newMinAmount = Math.min(newAmount - minSliderDeltaAsAmount, min)
          setAmountRange([newMinAmount, newAmount])
        }
      }

  return (
    <>
      <Slider
        trackWidth={trackWidth}
        setIsSliding={setIsSliding}
        onDrag={onDrag('min')}
        hitSlop={{ bottom: sectionContainerGap, left: trackWidth, right: sliderDelta / 2 + sliderWidth }}
        type="buy"
        transform={[{ translateX: minTranslateX }]}
      />
      <Slider
        trackWidth={trackWidth}
        setIsSliding={setIsSliding}
        onDrag={onDrag('max')}
        hitSlop={{ bottom: sectionContainerGap, left: sliderDelta / 2 - sliderWidth, right: trackWidth }}
        type="buy"
        transform={[{ translateX: maxTranslateX }]}
      />
    </>
  )
}

function BuyAmountInput ({ minAmountDelta, type }: { minAmountDelta: number; type: 'min' | 'max' }) {
  const inputRef = useRef<TextInput>(null)
  const [[min, max], setAmountRange] = useOfferPreferences(
    (state) => [state.buyAmountRange, state.setBuyAmountRange],
    shallow,
  )
  const amount = type === 'min' ? min : max

  const [inputValue, setInputValue] = useState(amount.toString())
  const restrictAmount = useRestrictSatsAmount('buy')

  const onFocus = () => setInputValue(amount.toString())

  const onChangeText = (value: string) => setInputValue(enforceDigitFormat(value))

  const getNewRange = (newAmount: number): [number, number] => {
    if (type === 'min') {
      const newMax = restrictAmount(Math.max(max, newAmount + minAmountDelta))
      const newMin = Math.min(newAmount, newMax - minAmountDelta)
      return [newMin, newMax]
    }
    const newMin = restrictAmount(Math.min(min, newAmount - minAmountDelta))
    const newMax = Math.max(newAmount, newMin + minAmountDelta)
    return [newMin, newMax]
  }
  const onEndEditing = ({ nativeEvent: { text } }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const newAmount = restrictAmount(Number(enforceDigitFormat(text)))
    const newRange = getNewRange(newAmount)
    setAmountRange(newRange)
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
  const [peachWalletActive, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.payoutAddressLabel],
    shallow,
  )
  const buyOfferPreferences = useOfferPreferences(
    (state) => ({
      amount: state.buyAmountRange,
      meansOfPayment: state.meansOfPayment,
      paymentData: state.paymentData,
      originalPaymentData: state.originalPaymentData,
      maxPremium: state.filter.buyOffer.shouldApplyMaxPremium ? state.filter.buyOffer.maxPremium : null,
      minReputation: state.filter.buyOffer.shouldApplyMinReputation ? state.filter.buyOffer.minReputation : null,
    }),
    shallow,
  )

  const offerDraft = {
    type: 'bid' as const,
    releaseAddress: '',
    ...buyOfferPreferences,
    walletLabel: peachWalletActive ? i18n('peachWallet') : payoutAddressLabel,
  }

  const originalPaymentData = useOfferPreferences((state) => state.originalPaymentData)
  const methodsAreValid = originalPaymentData.every(isValidPaymentData)
  const { data } = useMarketPrices()
  const [minAmount, maxAmount] = getTradingAmountLimits(data?.CHF || 0, 'buy')
  const rangeIsValid
    = offerDraft.amount[0] >= minAmount
    && offerDraft.amount[1] <= maxAmount
    && offerDraft.amount[0] <= offerDraft.amount[1]
  const formValid = methodsAreValid && rangeIsValid
  const { mutate: publishOffer, isLoading: isPublishing } = usePublishOffer(offerDraft)
  const offerId = useRoute<'buyOfferPreferences'>().params?.offerId

  const { mutate: patchOffer, isLoading: isPatching } = usePatchOffer()
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const onPress = () => {
    if (offerId) {
      const { maxPremium, minReputation, meansOfPayment, amount, paymentData } = offerDraft
      const newData = {
        maxPremium,
        minReputation,
        meansOfPayment,
        paymentData,
        amount,
      }
      patchOffer(
        { offerId, newData },
        {
          onSuccess: () => navigation.goBack(),
          onSettled: () => queryClient.invalidateQueries({ queryKey: matchesKeys.matchesByOfferId(offerId) }),
        },
      )
    } else {
      publishOffer()
    }
  }
  return (
    <Button
      style={tw`self-center px-5 py-3 bg-success-main min-w-166px`}
      onPress={onPress}
      disabled={!formValid}
      loading={isPublishing || isPatching}
    >
      Show Offers
    </Button>
  )
}
