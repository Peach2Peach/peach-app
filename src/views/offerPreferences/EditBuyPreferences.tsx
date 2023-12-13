/* eslint-disable max-lines */
import { useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { Button } from '../../components/buttons/Button'
import { useMarketPrices, useNavigation, useRoute, useToggleBoolean } from '../../hooks'
import { usePatchOffer } from '../../hooks/offer'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getTradingAmountLimits } from '../../utils/market/getTradingAmountLimits'
import { interpolate } from '../../utils/math/interpolate'
import { isBuyOffer } from '../../utils/offer/isBuyOffer'
import { isValidPaymentData } from '../../utils/paymentMethod/isValidPaymentData'
import { LoadingScreen } from '../loading/LoadingScreen'
import { matchesKeys } from '../search/hooks/useOfferMatches'
import { AmountSelectorComponent } from './components/AmountSelectorComponent'
import { FilterContainer } from './components/FilterContainer'
import { MarketInfo } from './components/MarketInfo'
import { MaxPremiumFilterComponent } from './components/MaxPremiumFilterComponent'
import { ReputationFilterComponent } from './components/MinReputationFilter'
import { PreferenceScreen } from './components/PreferenceScreen'

const OfferContext = createContext<BuyOffer | null>(null)
const useOfferContext = () => {
  const context = useContext(OfferContext)
  if (!context) {
    throw new Error('useOfferContext must be used within OfferContextProvider')
  }
  return context
}

export function EditBuyPreferences () {
  const [isSliding, setIsSliding] = useState(false)
  const { offerId } = useRoute<'editBuyPreferences'>().params
  const { offer, isLoading } = useOfferDetails(offerId)
  if (offerId && isLoading) return <LoadingScreen />
  if (offer && !isBuyOffer(offer)) throw new Error('Offer is not a buy offer')

  return (
    <OfferContext.Provider value={offer || null}>
      <PreferenceScreen isSliding={isSliding} button={<ShowOffersButton />}>
        <MarketInfo type="sellOffers" />
        <Methods />
        <AmountSelector setIsSliding={setIsSliding} />
        <Filters />
      </PreferenceScreen>
    </OfferContext.Provider>
  )
}

function Methods () {
  return null
}

function AmountSelector ({ setIsSliding }: { setIsSliding: (isSliding: boolean) => void }) {
  const offer = useOfferContext()
  const offerRange = offer?.amount || ([0, 0] satisfies [number, number])
  const [buyAmountRange, setBuyAmountRange] = useState(offerRange)
  const setGlobalAmountRange = useOfferPreferences((state) => state.setBuyAmountRange)
  const onChange = (newRange: [number, number]) => {
    setBuyAmountRange(newRange)
    setGlobalAmountRange(newRange)
  }

  return <AmountSelectorComponent setIsSliding={setIsSliding} range={buyAmountRange} setRange={onChange} />
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
  const offer = useOfferContext()
  const offerReputation
    = typeof offer?.minReputation === 'number' ? interpolate(offer.minReputation, [-1, 1], [0, 5]) : null
  const [minReputation, setMinReputation] = useState(offerReputation)
  const setGlobalMinReputationFilter = useOfferPreferences((state) => state.setMinReputationFilter)
  const setShouldApplyMinReputation = useOfferPreferences((state) => state.setShouldApplyMinReputation)
  const onToggle = () => {
    const newReputation = minReputation === 4.5 ? null : 4.5
    setGlobalMinReputationFilter(newReputation)
    setShouldApplyMinReputation(newReputation !== null)
    setMinReputation(newReputation)
  }

  return <ReputationFilterComponent minReputation={minReputation} toggle={onToggle} />
}

function MaxPremiumFilter () {
  const offer = useOfferContext()
  const [maxPremium, setMaxPremium] = useState(offer?.maxPremium ?? null)
  const [shouldApplyFilter, toggle] = useToggleBoolean(maxPremium !== null)
  const setGlobalMaxPremium = useOfferPreferences((state) => state.setMaxPremiumFilter)
  const setGlobalShouldApplyMaxPremium = useOfferPreferences((state) => state.setShouldApplyMaxPremium)

  const onChange = (newMaxPremium: number) => {
    setMaxPremium(newMaxPremium)
    setGlobalMaxPremium(newMaxPremium)
  }
  const onToggle = () => {
    setGlobalShouldApplyMaxPremium(!shouldApplyFilter)
    toggle()
  }

  return (
    <MaxPremiumFilterComponent
      maxPremium={maxPremium}
      setMaxPremium={onChange}
      shouldApplyFilter={shouldApplyFilter}
      toggleShouldApplyFilter={onToggle}
    />
  )
}

function ShowOffersButton () {
  // TODO ensure defaults of offer are set
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
    }),
    shallow,
  )
  const filter = useOfferPreferences((state) => state.filter.buyOffer)
  const maxPremium = filter.shouldApplyMaxPremium ? filter.maxPremium : null
  const minReputation = filter.shouldApplyMinReputation ? interpolate(filter.minReputation || 0, [0, 5], [-1, 1]) : null

  const offerDraft = {
    type: 'bid' as const,
    releaseAddress: '',
    ...buyOfferPreferences,
    maxPremium,
    minReputation,
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
  const { offerId } = useRoute<'editBuyPreferences'>().params

  const { mutate: patchOffer, isLoading: isPatching } = usePatchOffer()
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const onPress = () => {
    const { meansOfPayment, amount, paymentData } = offerDraft
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
  }
  return (
    <Button
      style={tw`self-center px-5 py-3 bg-success-main min-w-166px`}
      onPress={onPress}
      disabled={!formValid}
      loading={isPatching}
    >
      Show Offers
    </Button>
  )
}
