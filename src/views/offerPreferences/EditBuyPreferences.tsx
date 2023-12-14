/* eslint-disable max-lines */
import { useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useReducer, useState } from 'react'
import { Button } from '../../components/buttons/Button'
import { MeansOfPayment } from '../../components/offer/MeansOfPayment'
import { useNavigation, useRoute } from '../../hooks'
import { usePatchOffer } from '../../hooks/offer'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import tw from '../../styles/tailwind'
import { interpolate } from '../../utils/math/interpolate'
import { hasMopsConfigured } from '../../utils/offer/hasMopsConfigured'
import { isBuyOffer } from '../../utils/offer/isBuyOffer'
import { LoadingScreen } from '../loading/LoadingScreen'
import { matchesKeys } from '../search/hooks/useOfferMatches'
import { AmountSelectorComponent } from './components/AmountSelectorComponent'
import { FilterContainer } from './components/FilterContainer'
import { MarketInfo } from './components/MarketInfo'
import { MaxPremiumFilterComponent } from './components/MaxPremiumFilterComponent'
import { ReputationFilterComponent } from './components/MinReputationFilter'
import { PreferenceScreen } from './components/PreferenceScreen'
import { Section } from './components/Section'

type OfferAction =
  | { type: 'amount_changed'; amount: [number, number] }
  | { type: 'premium_changed'; premium: number }
  | { type: 'reputation_toggled' }
  | { type: 'max_premium_toggled' }
const OfferContext = createContext<[BuyOffer, React.Dispatch<OfferAction>] | null>(null)
const useOfferContext = () => {
  const context = useContext(OfferContext)
  if (!context) {
    throw new Error('useOfferContext must be used within OfferContextProvider')
  }
  return context
}

function offerReducer (state: BuyOffer, action: OfferAction) {
  switch (action.type) {
  case 'amount_changed': {
    return { ...state, amount: action.amount }
  }
  case 'premium_changed': {
    return { ...state, maxPremium: action.premium }
  }
  case 'reputation_toggled': {
    return { ...state, minReputation: state.minReputation === 4.5 ? null : 4.5 }
  }
  case 'max_premium_toggled': {
    return { ...state, maxPremium: state.maxPremium === null ? 0 : null }
  }
  default: {
    return state
  }
  }
}

export function EditBuyPreferences () {
  const { offerId } = useRoute<'editBuyPreferences'>().params
  const { offer, isLoading } = useOfferDetails(offerId)

  if (isLoading || !offer) return <LoadingScreen />
  if (!isBuyOffer(offer)) throw new Error('Offer is not a buy offer')

  return <ScreenContent offer={offer} />
}

function initializer (offer: BuyOffer) {
  const minReputation
    = typeof offer?.minReputation === 'number' ? interpolate(offer.minReputation, [-1, 1], [0, 5]) : null
  const maxPremium = offer?.maxPremium ?? null
  return { ...offer, minReputation, maxPremium }
}

function ScreenContent ({ offer }: { offer: BuyOffer }) {
  const [isSliding, setIsSliding] = useState(false)
  const reducer = useReducer(offerReducer, offer, initializer)
  return (
    <OfferContext.Provider value={reducer}>
      <PreferenceScreen isSliding={isSliding} button={<ShowOffersButton />}>
        <OfferMarketInfo />
        <OfferMethods />
        <AmountSelector setIsSliding={setIsSliding} />
        <Filters />
      </PreferenceScreen>
    </OfferContext.Provider>
  )
}

function OfferMarketInfo () {
  const [{ amount, maxPremium, minReputation, meansOfPayment }] = useOfferContext()
  return (
    <MarketInfo
      type={'sellOffers'}
      meansOfPayment={meansOfPayment}
      maxPremium={maxPremium || undefined}
      minReputation={minReputation || undefined}
      buyAmountRange={amount}
    />
  )
}

function OfferMethods () {
  const [{ meansOfPayment }] = useOfferContext()
  const hasSelectedMethods = hasMopsConfigured(meansOfPayment)
  const backgroundColor = tw.color('success-mild-1')
  return (
    <Section.Container style={{ backgroundColor }}>
      {hasSelectedMethods ? (
        <MeansOfPayment meansOfPayment={meansOfPayment} style={tw`flex-1`} />
      ) : (
        <Section.Title>all payment methods</Section.Title>
      )}
    </Section.Container>
  )
}

function AmountSelector ({ setIsSliding }: { setIsSliding: (isSliding: boolean) => void }) {
  const [offer, dispatch] = useOfferContext()
  const offerRange = offer?.amount || ([0, 0] satisfies [number, number])

  function handleAmountChange (newAmount: [number, number]) {
    dispatch({
      type: 'amount_changed',
      amount: newAmount,
    })
  }

  return <AmountSelectorComponent setIsSliding={setIsSliding} range={offerRange} setRange={handleAmountChange} />
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
  const [{ minReputation }, dispatch] = useOfferContext()

  function handleToggle () {
    dispatch({
      type: 'reputation_toggled',
    })
  }

  return <ReputationFilterComponent minReputation={minReputation} toggle={handleToggle} />
}

function MaxPremiumFilter () {
  const [offer, dispatch] = useOfferContext()
  const maxPremium = offer?.maxPremium ?? null

  function handlePremiumChange (newPremium: number) {
    dispatch({
      type: 'premium_changed',
      premium: newPremium,
    })
  }

  function handleToggle () {
    dispatch({
      type: 'max_premium_toggled',
    })
  }

  return (
    <MaxPremiumFilterComponent
      maxPremium={maxPremium}
      setMaxPremium={handlePremiumChange}
      shouldApplyFilter={maxPremium !== null}
      toggleShouldApplyFilter={handleToggle}
    />
  )
}

function ShowOffersButton () {
  const [buyOffer] = useOfferContext()
  const { amount, maxPremium } = buyOffer
  const minReputation = interpolate(buyOffer.minReputation || 0, [0, 5], [-1, 1])

  const rangeIsValid = amount[0] <= amount[1]
  const formValid = rangeIsValid
  const { offerId } = useRoute<'editBuyPreferences'>().params

  const { mutate: patchOffer, isLoading: isPatching } = usePatchOffer()
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const onPress = () => {
    const newData = { maxPremium, minReputation, amount }
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
