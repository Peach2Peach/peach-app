import { useMemo, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { peachyGradient } from '../../utils/layout'
import { isLimitReached } from '../../utils/match'
import { isBuyOffer } from '../../utils/offer'
import { GradientBorder } from '../GradientBorder'
import { MatchOfferButton } from './buttons'
import { options } from './buttons/options'
import { MatchCardCounterparty, PaymentMethodSelector } from './components'
import { BuyOfferMatchPrice } from './components/BuyOfferMatchPrice'
import { MatchPaymentDetails } from './components/MatchPaymentDetails'
import { MatchedOverlay } from './components/MatchedOverlay'
import { SellOfferMatchPrice } from './components/SellOfferMatchPrice'
import { useInterruptibleFunction, useMatchOffer } from './hooks'
import { useMatchStore } from './store'

type MatchProps = ComponentProps & { match: Match; offer: BuyOffer | SellOffer }

export const Match = ({ match, offer }: MatchProps) => {
  const { mutate } = useMatchOffer(offer, match)
  const [showMatchedCard, setShowMatchedCard] = useState(match.matched)
  const { interruptibleFn: matchFunction, interrupt: interruptMatchFunction } = useInterruptibleFunction(() => {
    mutate(undefined, { onError: () => setShowMatchedCard(false) })
  }, 5000)

  const onMatchPress = () => {
    if (isBuyOffer(offer)) {
      setShowMatchedCard(true)
      matchFunction()
    } else {
      mutate()
    }
  }

  const selectedPaymentMethod = useMatchStore((state) => state.matchSelectors[match.offerId]?.selectedPaymentMethod)

  const tradingLimitReached = isLimitReached(match.unavailable.exceedsLimit || [], selectedPaymentMethod)

  const missingSelection = !selectedPaymentMethod
  const isMatched = match.matched || showMatchedCard

  const currentOptionName = useMemo(
    () =>
      isMatched
        ? 'offerMatched'
        : tradingLimitReached
          ? 'tradingLimitReached'
          : missingSelection
            ? 'missingSelection'
            : isBuyOffer(offer)
              ? 'matchOffer'
              : 'acceptMatch',
    [isMatched, missingSelection, offer, tradingLimitReached],
  )

  return (
    <View onStartShouldSetResponder={() => true} style={tw`flex-shrink`}>
      <GradientBorder
        gradient={peachyGradient}
        gradientBorderWidths={[4, 4, 0, 4]}
        defaultBorderWidths={[1, 1, 0, 1]}
        showBorder={showMatchedCard}
        containerStyle={[
          tw`flex-shrink overflow-hidden rounded-t-2xl`,
          !showMatchedCard && [tw`border border-b-0`, options[currentOptionName].borderColor],
        ]}
        style={tw`rounded-t-xl bg-primary-background-light`}
      >
        <>
          <View style={[tw`px-4 py-6 gap-4`, tw.md`px-6 pt-8 pb-10 gap-8`]}>
            <MatchCardCounterparty user={match.user} />
            {isBuyOffer(offer) ? (
              <>
                <BuyOfferMatchPrice {...{ match, offer }} />
                <PaymentMethodSelector matchId={match.offerId} disabled={currentOptionName === 'tradingLimitReached'} />
              </>
            ) : (
              <>
                <SellOfferMatchPrice {...{ match, offer }} />
                <MatchPaymentDetails match={match} style={tw`mb-2`} />
              </>
            )}
          </View>
          {isMatched && isBuyOffer(offer) && (
            <MatchedOverlay {...{ match, offer, interruptMatchFunction, setShowMatchedCard }} />
          )}
        </>
      </GradientBorder>
      <MatchOfferButton matchId={match.offerId} matchOffer={onMatchPress} optionName={currentOptionName} />
    </View>
  )
}
