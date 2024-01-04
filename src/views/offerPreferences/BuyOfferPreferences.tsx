import { useState } from 'react'
import { shallow } from 'zustand/shallow'
import { Button } from '../../components/buttons/Button'
import { useSetPopup } from '../../components/popup/Popup'
import { HelpPopup } from '../../hooks/HelpPopup'
import { useOfferPreferences } from '../../store/offerPreferenes'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { interpolate } from '../../utils/math/interpolate'
import { isValidPaymentData } from '../../utils/paymentMethod/isValidPaymentData'
import { AmountSelectorComponent } from './components/AmountSelectorComponent'
import { BuyBitcoinHeader } from './components/BuyBitcoinHeader'
import { FilterContainer } from './components/FilterContainer'
import { MarketInfo } from './components/MarketInfo'
import { MaxPremiumFilterComponent } from './components/MaxPremiumFilterComponent'
import { ReputationFilterComponent } from './components/MinReputationFilter'
import { PreferenceMethods } from './components/PreferenceMethods'
import { PreferenceScreen } from './components/PreferenceScreen'
import { usePublishBuyOffer } from './utils/usePublishBuyOffer'
import { useRestrictSatsAmount } from './utils/useRestrictSatsAmount'
import { useTradingAmountLimits } from './utils/useTradingAmountLimits'

export function BuyOfferPreferences () {
  const [isSliding, setIsSliding] = useState(false)

  return (
    <PreferenceScreen isSliding={isSliding} header={<PreferenceHeader />} button={<ShowOffersButton />}>
      <PreferenceMarketInfo />
      <PreferenceMethods type="buy" />
      <AmountSelector setIsSliding={setIsSliding} />
      <Filters />
    </PreferenceScreen>
  )
}

function PreferenceHeader () {
  const setPopup = useSetPopup()
  const showHelp = () => setPopup(<HelpPopup id="buyingBitcoin" />)
  return <BuyBitcoinHeader icons={[{ ...headerIcons.help, onPress: showHelp }]} />
}

function PreferenceMarketInfo () {
  const offerPreferenes = useOfferPreferences(
    (state) => ({
      buyAmountRange: state.buyAmountRange,
      meansOfPayment: state.meansOfPayment,
      maxPremium: state.filter.buyOffer.shouldApplyMaxPremium
        ? state.filter.buyOffer.maxPremium || undefined
        : undefined,
      minReputation: interpolate(state.filter.buyOffer.minReputation || 0, [0, 5], [-1, 1]),
    }),
    shallow,
  )
  return <MarketInfo type="sellOffers" {...offerPreferenes} />
}

function AmountSelector ({ setIsSliding }: { setIsSliding: (isSliding: boolean) => void }) {
  const [buyAmountRange, setBuyAmountRange] = useOfferPreferences(
    (state) => [state.buyAmountRange, state.setBuyAmountRange],
    shallow,
  )

  return <AmountSelectorComponent setIsSliding={setIsSliding} range={buyAmountRange} setRange={setBuyAmountRange} />
}

function Filters () {
  return (
    <FilterContainer
      filters={
        <>
          <MaxPremiumFilter />
          <ReputationFilter />
        </>
      }
    />
  )
}

function ReputationFilter () {
  const [minReputation, toggle] = useOfferPreferences(
    (state) => [state.filter.buyOffer.minReputation, state.toggleMinReputationFilter],
    shallow,
  )
  return <ReputationFilterComponent minReputation={minReputation} toggle={toggle} />
}

function MaxPremiumFilter () {
  const [maxPremium, setMaxPremium] = useOfferPreferences(
    (state) => [state.filter.buyOffer.maxPremium, state.setMaxPremiumFilter],
    shallow,
  )
  const [shouldApplyFilter, toggle] = useOfferPreferences(
    (state) => [state.filter.buyOffer.shouldApplyMaxPremium, state.toggleShouldApplyMaxPremium],
    shallow,
  )

  return (
    <MaxPremiumFilterComponent
      maxPremium={maxPremium}
      setMaxPremium={setMaxPremium}
      shouldApplyFilter={shouldApplyFilter}
      toggleShouldApplyFilter={toggle}
    />
  )
}

function ShowOffersButton () {
  const { amount, meansOfPayment, paymentData, maxPremium, minReputation } = useOfferPreferences(
    (state) => ({
      amount: state.buyAmountRange,
      meansOfPayment: state.meansOfPayment,
      paymentData: state.paymentData,
      maxPremium: state.filter.buyOffer.shouldApplyMaxPremium ? state.filter.buyOffer.maxPremium : null,
      minReputation: interpolate(state.filter.buyOffer.minReputation || 0, [0, 5], [-1, 1]),
    }),
    shallow,
  )

  const originalPaymentData = useOfferPreferences((state) => state.originalPaymentData)
  const methodsAreValid = originalPaymentData.every(isValidPaymentData)
  const [minAmount, maxAmount] = useTradingAmountLimits('buy')
  const restrictAmount = useRestrictSatsAmount('buy')
  const setBuyAmountRange = useOfferPreferences((state) => state.setBuyAmountRange)
  const rangeIsWithinLimits = amount[0] >= minAmount && amount[1] <= maxAmount
  if (!rangeIsWithinLimits) {
    setBuyAmountRange([restrictAmount(amount[0]), restrictAmount(amount[1])])
  }
  const rangeIsValid = rangeIsWithinLimits && amount[0] <= amount[1]
  const formValid = methodsAreValid && rangeIsValid

  const { mutate: publishOffer, isLoading: isPublishing } = usePublishBuyOffer({
    amount,
    meansOfPayment,
    paymentData,
    maxPremium,
    minReputation,
  })

  return (
    <Button
      style={tw`self-center px-5 py-3 bg-success-main min-w-166px`}
      onPress={() => publishOffer()}
      disabled={!formValid}
      loading={isPublishing}
    >
      {i18n('offerPreferences.showOffers')}
    </Button>
  )
}
