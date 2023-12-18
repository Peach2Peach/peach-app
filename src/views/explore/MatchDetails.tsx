import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { View } from 'react-native'
import { Match as MatchType } from '../../../peach-api/src/@types/match'
import { GradientBorder } from '../../components/GradientBorder'
import { Header } from '../../components/Header'
import { PeachyGradient } from '../../components/PeachyGradient'
import { ProfileInfo } from '../../components/ProfileInfo'
import { Screen } from '../../components/Screen'
import { Button } from '../../components/buttons/Button'
import { UnmatchButton } from '../../components/matches/buttons/UnmatchButton'
import { options } from '../../components/matches/buttons/options'
import { EscrowLink } from '../../components/matches/components/EscrowLink'
import { PriceInfo } from '../../components/matches/components/PriceInfo'
import { PaymentMethodSelector } from '../../components/matches/components/selectors/PaymentMethodSelector'
import { useInterruptibleFunction } from '../../components/matches/hooks/useInterruptibleFunction'
import { useMatchAsBuyer } from '../../components/matches/hooks/useMatchAsBuyer'
import { getMatchPrice } from '../../components/matches/utils/getMatchPrice'
import { HorizontalLine } from '../../components/ui/HorizontalLine'
import { SATSINBTC } from '../../constants'
import { useMarketPrices, useRoute } from '../../hooks'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import tw from '../../styles/tailwind'
import { isLimitReached } from '../../utils/match/isLimitReached'
import { round } from '../../utils/math/round'
import { keys } from '../../utils/object/keys'
import { isBuyOffer } from '../../utils/offer/isBuyOffer'
import { getPaymentMethods } from '../../utils/paymentMethod/getPaymentMethods'
import { paymentMethodAllowedForCurrency } from '../../utils/paymentMethod/paymentMethodAllowedForCurrency'
import { peachAPI } from '../../utils/peachAPI'
import { LoadingScreen } from '../loading/LoadingScreen'

export function MatchDetails () {
  const { matchId, offerId } = useRoute<'matchDetails'>().params

  const { data: match } = useMatchDetails({ offerId, matchId })
  const { offer } = useOfferDetails(offerId)

  if (!offer || !isBuyOffer(offer) || !match) return <LoadingScreen />
  return (
    <Screen showTradingLimit header={<MatchDetailsHeader />}>
      <Match match={match} offer={offer} />
    </Screen>
  )
}

function MatchDetailsHeader () {
  return <Header title="match details" />
}

function useMatchDetails ({ offerId, matchId }: { offerId: string; matchId: string }) {
  return useQuery({
    queryKey: ['matchDetails', offerId, matchId],
    queryFn: async () => {
      const { result } = await peachAPI.private.offer.getMatch({ offerId, matchId })

      if (!result) throw new Error('Match not found')
      return result
    },
  })
}

const MATCH_DELAY = 5000
function Match ({ match, offer }: { match: MatchType; offer: BuyOffer }) {
  const { mutate } = useMatchAsBuyer(offer, match)
  const { meansOfPayment } = match

  const availableCurrencies = keys(meansOfPayment)
  const allPaymentMethods = getPaymentMethods(meansOfPayment)
  const [selectedCurrency, setSelectedCurrency] = useState(availableCurrencies[0])

  const allMethodsForCurrency = allPaymentMethods.filter((p) => paymentMethodAllowedForCurrency(p, selectedCurrency))
  const paymentData = usePaymentDataStore((state) => state.getPaymentDataArray())
  const dataForCurrency = paymentData.filter((d) => allMethodsForCurrency.includes(d.type))
  const defaultData = dataForCurrency.length === 1 ? dataForCurrency[0] : undefined
  const [selectedPaymentData, setSelectedPaymentData] = useState(defaultData)

  const [showMatchedCard, setShowMatchedCard] = useState(match.matched)
  const isMatched = match.matched || showMatchedCard

  const { interruptibleFn: matchFunction, interrupt: interruptMatchFunction } = useInterruptibleFunction(() => {
    mutate({ selectedCurrency, paymentData: selectedPaymentData }, { onError: () => setShowMatchedCard(false) })
  }, MATCH_DELAY)
  const onInterruptMatch = () => {
    interruptMatchFunction()
    setShowMatchedCard(false)
  }

  const onMatchPress = () => {
    setShowMatchedCard(true)
    matchFunction()
  }

  const [showPaymentMethodPulse, setShowPaymentMethodPulse] = useState(false)

  const tradingLimitReached = isLimitReached(match.unavailable.exceedsLimit || [], selectedPaymentData?.type)

  const currentOptionName = useMemo(
    () =>
      isMatched
        ? 'offerMatched'
        : tradingLimitReached
          ? 'tradingLimitReached'
          : !selectedPaymentData
            ? 'missingSelection'
            : 'matchOffer',
    [isMatched, selectedPaymentData, tradingLimitReached],
  )
  return (
    <>
      <View style={tw`justify-center flex-1`}>
        <GradientBorder
          gradientBorderWidth={4}
          showBorder={isMatched}
          style={[tw`overflow-hidden rounded-2xl`, options[currentOptionName].backgroundColor]}
          onStartShouldSetResponder={() => true}
        >
          <View style={tw`bg-primary-background-light rounded-xl`}>
            <View style={tw`gap-4 p-4`}>
              <ProfileInfo user={match.user} isOnMatchCard />

              <HorizontalLine />

              <BuyerPriceInfo
                match={match}
                selectedCurrency={selectedCurrency}
                selectedPaymentMethod={selectedPaymentData?.type || allMethodsForCurrency[0]}
              />

              <HorizontalLine />

              <PaymentMethodSelector
                match={match}
                disabled={currentOptionName === 'tradingLimitReached'}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                selectedPaymentData={selectedPaymentData}
                setSelectedPaymentData={setSelectedPaymentData}
                showPaymentMethodPulse={showPaymentMethodPulse}
              />

              <HorizontalLine />

              <EscrowLink address={match.escrow || ''} />
            </View>
            {isMatched && (
              <>
                <View
                  style={tw`absolute top-0 left-0 w-full h-full overflow-hidden opacity-75 rounded-t-xl`}
                  pointerEvents="none"
                >
                  <PeachyGradient />
                </View>
                <View
                  style={tw`absolute top-0 left-0 items-center justify-center w-full h-full`}
                  pointerEvents="box-none"
                >
                  <UnmatchButton
                    {...{ match, offer }}
                    interruptMatching={onInterruptMatch}
                    setShowMatchedCard={setShowMatchedCard}
                  />
                </View>
              </>
            )}
          </View>
        </GradientBorder>
      </View>
      <MatchOfferButton
        matchOffer={onMatchPress}
        optionName={currentOptionName}
        setShowPaymentMethodPulse={setShowPaymentMethodPulse}
      />
    </>
  )
}

type Props = {
  matchOffer: () => void
  optionName: keyof typeof options
  setShowPaymentMethodPulse: (showPulse: boolean) => void
}

function MatchOfferButton ({ matchOffer, optionName, setShowPaymentMethodPulse }: Props) {
  const onPress = () => {
    if (optionName === 'matchOffer') {
      matchOffer()
    } else if (optionName === 'missingSelection') {
      setShowPaymentMethodPulse(true)
    }
  }

  return (
    <Button
      style={[
        tw`flex-row items-center self-center justify-center py-2 gap-10px`,
        optionName === 'missingSelection' && tw`bg-success-mild-2`,
        optionName === 'tradingLimitReached' && tw`bg-black-3`,
      ]}
      onPress={onPress}
      disabled={optionName === 'offerMatched'}
    >
      {optionName === 'tradingLimitReached' ? 'trading limit reached' : 'request trade'}
    </Button>
  )
}

type PriceInfoProps = {
  match: Match
  selectedCurrency: Currency
  selectedPaymentMethod: PaymentMethod
}

function BuyerPriceInfo ({ match, selectedCurrency, selectedPaymentMethod }: PriceInfoProps) {
  const { data: priceBook, isSuccess } = useMarketPrices()

  const amountInBTC = match.amount / SATSINBTC
  const displayPrice = getMatchPrice(match, selectedPaymentMethod, selectedCurrency)

  const bitcoinPrice = priceBook?.[selectedCurrency] ?? amountInBTC / displayPrice

  const marketPrice = amountInBTC * bitcoinPrice

  const premium = match.matched ? (isSuccess ? round((displayPrice / marketPrice - 1) * 100, 2) : 0) : match.premium

  return <PriceInfo amount={match.amount} price={displayPrice} currency={selectedCurrency} premium={premium} />
}
