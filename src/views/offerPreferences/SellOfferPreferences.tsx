/* eslint-disable max-lines */
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useRef, useState } from 'react'
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInput,
  TextInputEndEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native'
import { shallow } from 'zustand/shallow'
import { MeansOfPayment } from '../../../peach-api/src/@types/payment'
import { LogoIcons } from '../../assets/logo'
import { Badge } from '../../components/Badge'
import { Header } from '../../components/Header'
import { PremiumInput } from '../../components/PremiumInput'
import { TouchableIcon } from '../../components/TouchableIcon'
import { NewBubble } from '../../components/bubble/Bubble'
import { Button } from '../../components/buttons/Button'
import { Toggle } from '../../components/inputs'
import { Checkbox } from '../../components/inputs/Checkbox'
import { PeachText } from '../../components/text/PeachText'
import { SATSINBTC } from '../../constants'
import { useNavigation, useToggleBoolean } from '../../hooks'
import { useFeeEstimate } from '../../hooks/query/useFeeEstimate'
import { useMarketPrices } from '../../hooks/query/useMarketPrices'
import { useTradingLimits } from '../../hooks/query/useTradingLimits'
import { useBitcoinPrices } from '../../hooks/useBitcoinPrices'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { InfoPopup } from '../../popups/InfoPopup'
import { useConfigStore } from '../../store/configStore/configStore'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { useSettingsStore } from '../../store/settingsStore'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { convertFiatToSats } from '../../utils/market/convertFiatToSats'
import { getTradingAmountLimits } from '../../utils/market/getTradingAmountLimits'
import { round } from '../../utils/math/round'
import { keys } from '../../utils/object/keys'
import { defaultFundingStatus } from '../../utils/offer/constants'
import { cleanPaymentData } from '../../utils/paymentMethod/cleanPaymentData'
import { isValidPaymentData } from '../../utils/paymentMethod/isValidPaymentData'
import { peachAPI } from '../../utils/peachAPI'
import { signAndEncrypt } from '../../utils/pgp/signAndEncrypt'
import { priceFormat } from '../../utils/string/priceFormat'
import { isDefined } from '../../utils/validation/isDefined'
import { peachWallet } from '../../utils/wallet/setWallet'
import { useWalletState } from '../../utils/wallet/walletStore'
import { getFundingAmount } from '../fundEscrow/helpers/getFundingAmount'
import { useCreateEscrow } from '../fundEscrow/hooks/useCreateEscrow'
import { useFundFromPeachWallet } from '../fundEscrow/hooks/useFundFromPeachWallet'
import { FundMultipleOffers } from './components/FundMultipleOffers'
import { MarketInfo } from './components/MarketInfo'
import { PreferenceMethods } from './components/PreferenceMethods'
import { PreferenceScreen } from './components/PreferenceScreen'
import { SatsInputComponent } from './components/SatsInputComponent'
import { Section } from './components/Section'
import { Slider, sliderWidth } from './components/Slider'
import { SliderTrack } from './components/SliderTrack'
import { useFilteredMarketStats } from './components/useFilteredMarketStats'
import { trackMin } from './utils/constants'
import { enforceDigitFormat } from './utils/enforceDigitFormat'
import { publishSellOffer } from './utils/publishSellOffer'
import { useAmountInBounds } from './utils/useAmountInBounds'
import { useRestrictSatsAmount } from './utils/useRestrictSatsAmount'
import { useTrackWidth } from './utils/useTrackWidth'
import { useTradingAmountLimits } from './utils/useTradingAmountLimits'

export function SellOfferPreferences () {
  const [isSliding, setIsSliding] = useState(false)
  return (
    <PreferenceScreen header={<SellHeader />} button={<SellAction />} isSliding={isSliding}>
      <SellPreferenceMarketInfo />
      <PreferenceMethods type="sell" />
      <CompetingOfferStats />
      <AmountSelector setIsSliding={setIsSliding} />
      <FundMultipleOffersContainer />
      <InstantTrade />
      <RefundWallet />
    </PreferenceScreen>
  )
}

function SellPreferenceMarketInfo () {
  const preferences = useOfferPreferences(
    (state) => ({
      meansOfPayment: state.meansOfPayment,
      maxPremium: state.premium,
      sellAmount: state.sellAmount,
    }),
    shallow,
  )
  return <MarketInfo type="buyOffers" {...preferences} />
}

function usePastOffersStats ({ meansOfPayment }: { meansOfPayment: MeansOfPayment }) {
  return useQuery({
    queryKey: ['market', 'pastOffers', 'stats', { meansOfPayment }] as const,
    queryFn: async (context) => {
      const preferences = context.queryKey[3]
      const { result } = await peachAPI.public.market.getPastOffersStats(preferences)
      if (!result) throw new Error('no past offers stats found')
      return result
    },
    placeholderData: {
      avgPremium: 0,
    },
    keepPreviousData: true,
  })
}

function CompetingOfferStats () {
  const textStyle = tw`text-center text-primary-main subtitle-2`

  const meansOfPayment = useOfferPreferences((state) => state.meansOfPayment)
  const { data: pastOfferData } = usePastOffersStats({ meansOfPayment })
  const { data: marketStats } = useFilteredMarketStats({ type: 'ask', meansOfPayment })

  return (
    <Section.Container style={tw`gap-1 py-0`}>
      <PeachText style={textStyle}>{marketStats.offersWithinRange.length} competing sell offers</PeachText>
      <PeachText style={textStyle}>premium of completed trades: {pastOfferData?.avgPremium}%</PeachText>
    </Section.Container>
  )
}

function AmountSelector ({ setIsSliding }: { setIsSliding: (isSliding: boolean) => void }) {
  const trackWidth = useTrackWidth()

  return (
    <AmountSelectorContainer
      slider={
        <SliderTrack
          slider={<SellAmountSlider setIsSliding={setIsSliding} trackWidth={trackWidth} />}
          trackWidth={trackWidth}
          type="sell"
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

function AmountSelectorContainer ({ slider, inputs }: { slider?: JSX.Element; inputs?: JSX.Element }) {
  return (
    <Section.Container style={tw`bg-primary-background-dark`}>
      <Section.Title>amount to sell</Section.Title>
      <View style={tw`gap-5`}>
        <View style={tw`gap-2`}>
          <View style={tw`flex-row gap-10px`}>{inputs}</View>
          {slider}
        </View>
        <Premium />
      </View>
    </Section.Container>
  )
}

const replaceAllCommasWithDots = (value: string) => value.replace(/,/gu, '.')
const removeAllButOneDot = (value: string) => value.replace(/\.(?=.*\.)/gu, '')
const MIN_PREMIUM_INCREMENT = 0.01
function Premium () {
  const preferences = useOfferPreferences(
    (state) => ({
      maxPremium: state.premium - MIN_PREMIUM_INCREMENT,
      meansOfPayment: state.meansOfPayment,
    }),
    shallow,
  )
  const { data } = useFilteredMarketStats({ type: 'ask', ...preferences })
  return (
    <View style={tw`self-stretch gap-1`}>
      <PremiumInputComponent />
      <CurrentPrice />
      <PeachText style={tw`text-center text-primary-main subtitle-2`}>
        {data.offersWithinRange.length} competing sell offers below this premium
      </PeachText>
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
    <PeachText style={tw`text-center body-s`}>
      currently {priceWithPremium} {displayCurrency}
    </PeachText>
  )
}

type SellAmountSliderProps = {
  trackWidth: number
  setIsSliding: (isSliding: boolean) => void
}

function SellAmountSlider ({ trackWidth, setIsSliding }: SellAmountSliderProps) {
  const { data } = useMarketPrices()
  const [, maxLimit] = getTradingAmountLimits(data?.CHF || 0, 'sell')

  const trackMax = trackWidth - sliderWidth
  const trackDelta = trackMax - trackMin

  const getAmountInBounds = useAmountInBounds(trackWidth, 'sell')

  const [amount, setAmount] = useOfferPreferences((state) => [state.sellAmount, state.setSellAmount])
  const translateX = (amount / maxLimit) * trackDelta

  const onDrag = ({ nativeEvent: { pageX } }: GestureResponderEvent) => {
    const bounds = [trackMin, trackMax] as const
    const newAmount = getAmountInBounds(pageX, bounds)

    setAmount(newAmount)
  }

  return (
    <Slider
      trackWidth={trackWidth}
      setIsSliding={setIsSliding}
      onDrag={onDrag}
      type="sell"
      transform={[{ translateX }]}
    />
  )
}

export const inputContainerStyle = [
  'items-center justify-center flex-1 bg-primary-background-light flex-row',
  'border rounded-lg border-black-4',
]
export const textStyle = 'text-center subtitle-1 leading-relaxed py-1px'

function SatsInput () {
  const [amount, setAmount] = useOfferPreferences((state) => [state.sellAmount, state.setSellAmount])
  const inputRef = useRef<TextInput>(null)
  const [inputValue, setInputValue] = useState(String(amount))
  const restrictAmount = useRestrictSatsAmount('sell')

  const onFocus = () => setInputValue(String(amount))

  const onChangeText = (value: string) => setInputValue(enforceDigitFormat(value))

  const onEndEditing = ({ nativeEvent: { text } }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const newAmount = restrictAmount(Number(enforceDigitFormat(text)))
    setAmount(newAmount)
    setInputValue(String(newAmount))
  }

  const displayValue = inputRef.current?.isFocused() ? inputValue : String(amount)

  return (
    <SatsInputComponent
      value={displayValue}
      ref={inputRef}
      onFocus={onFocus}
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
    />
  )
}

function FiatInput () {
  const [amount, setAmount] = useOfferPreferences((state) => [state.sellAmount, state.setSellAmount])
  const inputRef = useRef<TextInput>(null)

  const { displayCurrency, bitcoinPrice, fiatPrice } = useBitcoinPrices(amount)
  const [inputValue, setInputValue] = useState(fiatPrice.toString())

  const restrictAmount = useRestrictSatsAmount('sell')

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
      <PeachText style={tw.style(textStyle)}> {i18n(displayCurrency)}</PeachText>
    </View>
  )
}

function FundMultipleOffersContainer () {
  const setPopup = usePopupStore((state) => state.setPopup)
  return (
    <Section.Container style={tw`flex-row items-start justify-between bg-primary-background-dark`}>
      <FundMultipleOffers />
      <TouchableIcon
        id="helpCircle"
        iconColor={tw.color('info-light')}
        onPress={() => setPopup(<FundMultiplePopup />)}
      />
    </Section.Container>
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
  const [hasSeenPopup, setHasSeenPopup] = useOfferPreferences(
    (state) => [state.hasSeenInstantTradePopup, state.setHasSeenInstantTradePopup],
    shallow,
  )
  const setPopup = usePopupStore((state) => state.setPopup)
  const onHelpIconPress = () => {
    setPopup(<InstantTradePopup />)
    setHasSeenPopup(true)
  }

  const onToggle = () => {
    if (!hasSeenPopup) {
      onHelpIconPress()
    }
    toggle()
  }

  return (
    <Section.Container style={tw`bg-primary-background-dark`}>
      <View style={tw`flex-row items-center self-stretch justify-between`}>
        <Toggle onPress={onToggle} enabled={enableInstantTrade} />
        <Section.Title>instant - trade</Section.Title>
        <TouchableIcon id="helpCircle" iconColor={tw.color('info-light')} onPress={onHelpIconPress} />
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
    </Section.Container>
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
    <Section.Container style={tw`bg-primary-background-dark`}>
      <Section.Title>refund to:</Section.Title>
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
    </Section.Container>
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
    <Section.Container style={tw`flex-row justify-between`}>
      <Checkbox
        checked={fundWithPeachWallet}
        text={`fund with Peach wallet (${estimatedFeeRate} sats/vb)`}
        onPress={toggle}
        style={tw`flex-1`}
      />
      <TouchableIcon id="bitcoin" onPress={onPress} />
    </Section.Container>
  )
}

function FundEscrowButton ({ fundWithPeachWallet }: { fundWithPeachWallet: boolean }) {
  const amountRange = useTradingAmountLimits('sell')
  const [sellAmount, instantTrade] = useOfferPreferences((state) => [state.sellAmount, state.instantTrade], shallow)
  const limits = useTradingLimits()
  const priceWithPremium = useCurrentOfferPrice()
  const [isPublishing, setIsPublishing] = useState(false)

  const sellAmountIsValid = sellAmount >= amountRange[0] && sellAmount <= amountRange[1]
  const restrictAmount = useRestrictSatsAmount('sell')
  const setSellAmount = useOfferPreferences((state) => state.setSellAmount)
  if (!sellAmountIsValid) {
    setSellAmount(restrictAmount(sellAmount))
  }

  const priceIsWithinLimits
    = priceWithPremium + limits.dailyAmount <= limits.daily && priceWithPremium + limits.yearlyAmount <= limits.yearly

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
  const paymentMethodsAreValid = sellPreferences.originalPaymentData.every(isValidPaymentData)
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
    if (!formValid) {
      let errorMessage
      if (!sellAmountIsValid) {
        errorMessage = `Amount must be between ${amountRange[0]} and ${amountRange[1]} sats`
      } else if (!priceIsWithinLimits) {
        errorMessage = 'Amount exceeds your trading limits'
      } else if (!paymentMethodsAreValid) {
        errorMessage = 'Please add a valid payment method'
      } else if (!sellPreferences.originalPaymentData.length) {
        errorMessage = 'Please add a payment method'
      } else {
        errorMessage = 'Something went wrong'
      }
      showErrorBanner(errorMessage)
      return
    }
    setIsPublishing(true)
    const { address } = peachWalletActive ? await peachWallet.getAddress() : { address: payoutAddress }
    if (!address) {
      setIsPublishing(false)
      return
    }
    const paymentData = await getPaymentData()
    const { isPublished, navigationParams, errorMessage, errorDetails } = await publishSellOffer({
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
      showErrorBanner(errorMessage, errorDetails)
      setIsPublishing(false)
    } else {
      setIsPublishing(false)
    }
  }

  return (
    <Button
      style={[tw`self-center px-5 py-3 min-w-166px`, !formValid && tw`bg-primary-mild-1`]}
      onPress={onPress}
      loading={isPublishing}
    >
      Fund Escrow
    </Button>
  )
}

function SellHeader () {
  const setPopup = usePopupStore((state) => state.setPopup)
  const onPress = () => setPopup(<SellingBitcoinPopup />)
  return (
    <Header
      titleComponent={
        <>
          <PeachText style={tw`h7 md:h6 text-primary-main`}>{i18n('sell')}</PeachText>
          <LogoIcons.bitcoinText style={tw`h-14px md:h-16px w-63px md:w-71px`} />
        </>
      }
      icons={[{ ...headerIcons.help, onPress }]}
    />
  )
}

function SellingBitcoinPopup () {
  return (
    <InfoPopup
      title="selling bitcoin"
      content={
        <PeachText>
          {
            // eslint-disable-next-line max-len
            'Selling your sats on Peach is free of charge!\n\nTo publish a sell offer, you must send your sats to an escrow to prove to the buyer that you have the sats you want to sell!\n\nThe escrow is a Bitcoin multi-signature wallet where you own one key and Peach holds another.'
          }
        </PeachText>
      }
    />
  )
}

function FundMultiplePopup () {
  return (
    <InfoPopup
      title="fund multiple sell offers"
      content={
        <PeachText>
          {
            // eslint-disable-next-line max-len
            'To save on network fees, you can create multiple sell offers with only one transaction!'
          }
        </PeachText>
      }
    />
  )
}

function InstantTradePopup () {
  return (
    <InfoPopup
      title="instant trade"
      content={
        <PeachText>
          {
            // eslint-disable-next-line max-len
            'Allow a buyer who matches your sell offer to automatically get in a trade with you!\n\nTo enable this, Peach will receive your selected payment data to instantly share them with a buyer that matches all of your criteria.\n\nThis data is encrypted and cannot be read by third parties other than Peach.'
          }
        </PeachText>
      }
    />
  )
}
