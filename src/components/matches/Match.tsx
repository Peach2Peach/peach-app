import { useMemo, useState } from 'react'
import { View } from 'react-native'
import { HorizontalLine } from '..'

import tw from '../../styles/tailwind'
import { peachyGradient } from '../../utils/layout'
import { isLimitReached } from '../../utils/match'
import { isBuyOffer } from '../../utils/offer'
import { GradientBorder } from '../GradientBorder'
import { RadialGradient } from '../RadialGradient'
import { MatchOfferButton, UnmatchButton } from './buttons'
import { options } from './buttons/options'
import { EscrowLink, MatchCardCounterparty, PaymentMethodSelector, PriceInfo } from './components'
import { useInterruptibleFunction, useMatchOffer } from './hooks'
import { MatchPaymentDetails } from './MatchPaymentDetails'
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
    <View onStartShouldSetResponder={() => true} style={tw`flex-shrink h-full justify-center`}>
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
          <View style={tw`p-4`}>
            <MatchCardCounterparty user={match.user} />
            <HorizontalLine style={tw`my-4`} />
            <PriceInfo {...{ match, offer }} />
            <HorizontalLine style={tw`my-4`} />

            {isBuyOffer(offer) ? (
              <>
                <PaymentMethodSelector matchId={match.offerId} disabled={currentOptionName === 'tradingLimitReached'} />
                <HorizontalLine style={tw`my-4`} />
                <EscrowLink address={match.escrow || ''} />
              </>
            ) : (
              <MatchPaymentDetails match={match} style={tw`mb-2`} />
            )}
          </View>
          {isMatched && isBuyOffer(offer) && (
            <>
              <View
                style={tw`absolute top-0 left-0 w-full h-full overflow-hidden opacity-75 rounded-t-xl`}
                pointerEvents="none"
              >
                <RadialGradient x="100%" y="0%" rx="110.76%" ry="117.21%" colorList={peachyGradient} />
              </View>
              <View style={tw`absolute top-0 left-0 items-center justify-center w-full h-full`} pointerEvents="box-none">
                <UnmatchButton
                  {...{ match, offer }}
                  interruptMatching={interruptMatchFunction}
                  showUnmatchedCard={() => setShowMatchedCard(false)}
                />
              </View>
            </>
          )}
        </>
      </GradientBorder>
      <MatchOfferButton matchId={match.offerId} matchOffer={onMatchPress} optionName={currentOptionName} />
    </View>
  )
}
