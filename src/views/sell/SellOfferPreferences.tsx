/* eslint-disable max-lines */
import { useQueryClient } from '@tanstack/react-query'
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
import { shallow } from 'zustand/shallow'
import { LogoIcons } from '../../assets/logo'
import { Checkbox, Header, Icon, PeachScrollView, Screen, Text, TouchableIcon } from '../../components'
import { Badge } from '../../components/Badge'
import { BTCAmount } from '../../components/bitcoin'
import { NewBubble } from '../../components/bubble/Bubble'
import { Button } from '../../components/buttons/Button'
import { Toggle } from '../../components/inputs'
import { MeansOfPayment } from '../../components/offer/MeansOfPayment'
import { SATSINBTC } from '../../constants'
import {
  useBitcoinPrices,
  useIsMediumScreen,
  useMarketPrices,
  useNavigation,
  useToggleBoolean,
  useTradingLimits,
} from '../../hooks'
import { useFeeEstimate } from '../../hooks/query/useFeeEstimate'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useConfigStore } from '../../store/configStore/configStore'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { convertFiatToSats, getTradingAmountLimits } from '../../utils/market'
import { round } from '../../utils/math'
import { keys } from '../../utils/object'
import { hasMopsConfigured } from '../../utils/offer'
import { defaultFundingStatus } from '../../utils/offer/constants'
import { cleanPaymentData } from '../../utils/paymentMethod'
import { signAndEncrypt } from '../../utils/pgp'
import { priceFormat } from '../../utils/string'
import { isDefined } from '../../utils/validation'
import { peachWallet } from '../../utils/wallet/setWallet'
import { useWalletState } from '../../utils/wallet/walletStore'
import { getFundingAmount } from '../fundEscrow/helpers/getFundingAmount'
import { useCreateEscrow } from '../fundEscrow/hooks/useCreateEscrow'
import { useFundFromPeachWallet } from '../fundEscrow/hooks/useFundFromPeachWallet'
import { Slider } from './Slider'
import { SliderTrack } from './SliderTrack'
import { PremiumInput } from './components'
import { FundMultipleOffers } from './components/FundMultipleOffers'
import { publishSellOffer } from './helpers/publishSellOffer'

export function SellOfferPreferences () {
  const [isSliding, setIsSliding] = useState(false)
  return (
    <Screen style={tw`bg-primary-background`} header={<SellHeader />}>
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
          <MeansOfPayment meansOfPayment={meansOfPayment} style={tw`flex-1`} />
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
      <Text style={tw`subtitle-1`}>amount to sell</Text>
      <View style={tw`gap-5`}>
        <View style={tw`gap-2`}>
          <View style={tw`flex-row gap-10px`}>{inputs}</View>
          {slider}
        </View>
        <Premium />
      </View>
    </SectionContainer>
  )
}

const replaceAllCommasWithDots = (value: string) => value.replace(/,/gu, '.')
const removeAllButOneDot = (value: string) => value.replace(/\.(?=.*\.)/gu, '')
function Premium () {
  return (
    <View style={tw`self-stretch gap-1`}>
      <PremiumInputComponent />
      <CurrentPrice />
      <Text style={tw`text-center body-s text-primary-dark-2`}>x competing sell offers below this premium</Text>
    </View>
  )
}

function PremiumInputComponent () {
  const [premium, setPremium] = useOfferPreferences((state) => [state.premium, state.setPremium])
  return <PremiumInput premium={premium} setPremium={setPremium} incrementBy={1} />
}

function useCurrentOfferPrice () {
  const [amount, premium] = useOfferPreferences((state) => [state.sellAmount, state.premium], shallow)
  const { fiatPrice } = useBitcoinPrices(amount)
  const priceWithPremium = useMemo(() => round(fiatPrice * (1 + premium / 100), 2), [fiatPrice, premium])
  return priceWithPremium
}

function CurrentPrice () {
  const displayCurrency = useSettingsStore((state) => state.displayCurrency)
  const priceWithPremium = useCurrentOfferPrice()

  return (
    <Text style={tw`text-center body-s`}>
      currently {priceWithPremium} {displayCurrency}
    </Text>
  )
}

const horizontalPaddingForSlider = 8
export const iconWidth = 16
export const horizontalSliderPadding = 8
const sliderWidth = iconWidth + horizontalSliderPadding * 2
const trackMin = horizontalPaddingForSlider
export const sectionContainerGap = 10

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
  const [enableInstantTrade, toggle, criteria, toggleMinTrades, toggleBadge, toggleMinReputation] = useOfferPreferences(
    (state) => [
      state.instantTrade,
      state.toggleInstantTrade,
      state.instantTradeCriteria,
      state.toggleMinTrades,
      state.toggleBadge,
      state.toggleMinReputation,
    ],
    shallow,
  )
  return (
    <SectionContainer style={tw`bg-primary-background-dark`}>
      <View style={tw`flex-row items-center self-stretch justify-between`}>
        <Toggle onPress={toggle} enabled={enableInstantTrade} />
        <Text style={tw`subtitle-1`}>instant - trade</Text>
        <TouchableIcon id="helpCircle" iconColor={tw.color('info-light')} />
      </View>
      {enableInstantTrade && (
        <>
          <Checkbox
            checked={criteria.minTrades !== 0}
            style={tw`self-stretch`}
            text="no new users"
            onPress={toggleMinTrades}
          />
          <Checkbox
            checked={criteria.minReputation !== 0}
            style={tw`self-stretch`}
            text="minimum reputation: 4.5"
            onPress={toggleMinReputation}
          />
          <View style={tw`flex-row items-start self-stretch gap-10px`}>
            <TouchableOpacity onPress={() => toggleBadge('fastTrader')}>
              <Badge badgeName="fastTrader" isUnlocked={criteria.badges.includes('fastTrader')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleBadge('superTrader')}>
              <Badge badgeName="superTrader" isUnlocked={criteria.badges.includes('superTrader')} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SectionContainer>
  )
}

function RefundWallet () {
  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.setPeachWalletActive, state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )
  const navigation = useNavigation()
  const onExternalWalletPress = () => {
    if (payoutAddress) {
      setPeachWalletActive(false)
    } else {
      navigation.navigate('payoutAddress', { type: 'refund' })
    }
  }
  return (
    <SectionContainer style={tw`bg-primary-background-dark`}>
      <Text style={tw`subtitle-1`}>refund to:</Text>
      <View style={tw`flex-row items-center gap-10px`}>
        <NewBubble color="orange" ghost={!peachWalletActive} onPress={() => setPeachWalletActive(true)}>
          peach wallet
        </NewBubble>
        <NewBubble
          color="orange"
          ghost={peachWalletActive}
          iconId={!payoutAddress ? 'plusCircle' : undefined}
          onPress={onExternalWalletPress}
        >
          {payoutAddressLabel || i18n('externalWallet')}
        </NewBubble>
      </View>
    </SectionContainer>
  )
}

function SellAction () {
  const [fundWithPeachWallet, toggle] = useToggleBoolean()
  return (
    <>
      <FundWithPeachWallet fundWithPeachWallet={fundWithPeachWallet} toggle={toggle} />
      <FundEscrowButton fundWithPeachWallet={fundWithPeachWallet} />
    </>
  )
}

function FundWithPeachWallet ({ fundWithPeachWallet, toggle }: { fundWithPeachWallet: boolean; toggle: () => void }) {
  const feeRate = useSettingsStore((state) => state.feeRate)
  const feeEstimate = useFeeEstimate()
  const estimatedFeeRate = typeof feeRate === 'number' ? feeRate : feeEstimate.estimatedFees[feeRate]
  const navigation = useNavigation()
  const onPress = () => navigation.navigate('networkFees')
  return (
    <SectionContainer style={tw`flex-row justify-between`}>
      <Checkbox
        checked={fundWithPeachWallet}
        text={`fund with Peach wallet (${estimatedFeeRate} sats/vb)`}
        onPress={toggle}
        style={tw`flex-1`}
      />
      <TouchableIcon id="bitcoin" onPress={onPress} />
    </SectionContainer>
  )
}

function FundEscrowButton ({ fundWithPeachWallet }: { fundWithPeachWallet: boolean }) {
  const { data } = useMarketPrices()
  const amountRange = getTradingAmountLimits(data?.CHF || 0, 'sell')
  const [sellAmount, instantTrade] = useOfferPreferences((state) => [state.sellAmount, state.instantTrade], shallow)
  const limits = useTradingLimits()
  const priceWithPremium = useCurrentOfferPrice()
  const [isPublishing, setIsPublishing] = useState(false)

  const sellAmountIsValid = sellAmount >= amountRange[0] && sellAmount <= amountRange[1]
  const priceIsWithinLimits
    = priceWithPremium + limits.dailyAmount <= limits.daily && priceWithPremium + limits.yearlyAmount <= limits.yearly
  const paymentMethodsAreValid = true

  const [peachWalletActive, payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.peachWalletActive, state.payoutAddress, state.payoutAddressLabel],
    shallow,
  )

  const sellPreferences = useOfferPreferences(
    (state) => ({
      amount: state.sellAmount,
      premium: state.premium,
      meansOfPayment: state.meansOfPayment,
      paymentData: state.paymentData,
      originalPaymentData: state.originalPaymentData,
      multi: state.multi,
      instantTradeCriteria: state.instantTrade ? state.instantTradeCriteria : undefined,
    }),
    shallow,
  )
  const formValid
    = sellAmountIsValid && priceIsWithinLimits && paymentMethodsAreValid && !!sellPreferences.originalPaymentData.length
  const navigation = useNavigation()
  const showErrorBanner = useShowErrorBanner()

  const fundFromPeachWallet = useFundFromPeachWallet()

  const getFundMultipleByOfferId = useWalletState((state) => state.getFundMultipleByOfferId)
  const { mutate: createEscrow } = useCreateEscrow()
  const queryClient = useQueryClient()

  const peachPGPPublicKey = useConfigStore((state) => state.peachPGPPublicKey)

  const getPaymentData = () => {
    const { paymentData, originalPaymentData } = sellPreferences
    if (instantTrade) {
      return keys(paymentData).reduce(async (accPromise: Promise<OfferPaymentData>, paymentMethod) => {
        const acc = await accPromise
        const originalData = originalPaymentData.find((e) => e.type === paymentMethod)
        if (originalData) {
          const cleanedData = cleanPaymentData(originalData)
          const { encrypted, signature } = await signAndEncrypt(JSON.stringify(cleanedData), peachPGPPublicKey)
          return {
            ...acc,
            [paymentMethod]: {
              ...paymentData[paymentMethod],
              encrypted,
              signature,
            },
          }
        }
        return acc
      }, Promise.resolve({}))
    }
    return Promise.resolve(paymentData)
  }

  const onPress = async () => {
    if (isPublishing) return
    setIsPublishing(true)
    const { address } = peachWalletActive ? await peachWallet.getReceivingAddress() : { address: payoutAddress }
    if (!address) {
      setIsPublishing(false)
      return
    }
    const paymentData = await getPaymentData()
    const { isPublished, navigationParams, errorMessage } = await publishSellOffer({
      ...sellPreferences,
      paymentData,
      type: 'ask',
      funding: defaultFundingStatus,
      walletLabel: peachWalletActive ? i18n('peachWallet') : payoutAddressLabel,
      returnAddress: address,
    })
    if (isPublished) {
      const fundMultiple = getFundMultipleByOfferId(navigationParams.offerId)
      const offerIds = fundMultiple?.offerIds || [navigationParams.offerId]

      createEscrow(offerIds, {
        onSuccess: async (res) => {
          let fundFromPeachWalletPromise

          if (fundWithPeachWallet) {
            const amount = getFundingAmount(fundMultiple, sellPreferences.amount)
            const fundingAddress
              = fundMultiple?.address || res.find((e) => e?.offerId === navigationParams.offerId)?.escrow
            const fundingAddresses = res.filter(isDefined).map((e) => e.escrow)
            fundFromPeachWalletPromise = await fundFromPeachWallet({
              offerId: navigationParams.offerId,
              amount,
              address: fundingAddress,
              addresses: fundingAddresses,
            })
          }

          navigation.reset({
            index: 1,
            routes: [
              { name: 'homeScreen', params: { screen: 'yourTrades', params: { tab: 'yourTrades.sell' } } },
              { name: 'fundEscrow', params: navigationParams },
            ],
          })
          offerIds.forEach((id) => queryClient.invalidateQueries({ queryKey: ['offer', id] }))
          return fundFromPeachWalletPromise
        },
        onError: () => {
          setIsPublishing(false)
        },
      })
    } else if (errorMessage) {
      showErrorBanner(errorMessage)
      setIsPublishing(false)
    } else {
      setIsPublishing(false)
    }
  }

  return (
    <Button style={tw`self-center px-5 py-3 min-w-166px`} onPress={onPress} disabled={!formValid} loading={isPublishing}>
      Fund Escrow
    </Button>
  )
}

function SectionContainer ({ children, style }: { children: React.ReactNode; style?: View['props']['style'] }) {
  return <View style={[tw`items-center w-full p-3 rounded-2xl`, { gap: sectionContainerGap }, style]}>{children}</View>
}

function SellHeader () {
  return (
    <Header
      titleComponent={
        <>
          <Text style={tw`h7 md:h6 text-primary-main`}>sell</Text>
          <LogoIcons.bitcoinText style={tw`h-14px md:h-16px w-63px md:w-71px`} />
        </>
      }
    />
  )
}
