import { useMemo, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import { isLimitReached } from '../../utils/match/isLimitReached'
import { isBuyOffer } from '../../utils/offer/isBuyOffer'
import { GradientBorder } from '../GradientBorder'
import { PeachyGradient } from '../PeachyGradient'
import { ProfileInfo } from '../ProfileInfo'
import { HorizontalLine } from '../ui/HorizontalLine'
import { MatchPaymentDetails } from './MatchPaymentDetails'
import { MatchOfferButton, UnmatchButton } from './buttons'
import { options } from './buttons/options'
import { EscrowLink } from './components/EscrowLink'
import { PriceInfo } from './components/PriceInfo'
import { PaymentMethodSelector } from './components/selectors/PaymentMethodSelector'
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
    <View style={tw`justify-center flex-1`}>
      <GradientBorder
        gradientBorderWidth={4}
        showBorder={showMatchedCard}
        style={[tw`overflow-hidden rounded-2xl`, options[currentOptionName].backgroundColor]}
        onStartShouldSetResponder={() => true}
      >
        <View style={tw`bg-primary-background-light rounded-t-xl`}>
          <View style={tw`gap-4 p-4`}>
            <ProfileInfo user={match.user} isOnMatchCard />
            <HorizontalLine />
            <PriceInfo {...{ match, offer }} />
            <HorizontalLine />

            {isBuyOffer(offer) ? (
              <>
                <PaymentMethodSelector matchId={match.offerId} disabled={currentOptionName === 'tradingLimitReached'} />
                <HorizontalLine />
                <EscrowLink address={match.escrow || ''} />
              </>
            ) : (
              <MatchPaymentDetails match={match} />
            )}
          </View>
          {isMatched && isBuyOffer(offer) && (
            <>
              <View
                style={tw`absolute top-0 left-0 w-full h-full overflow-hidden opacity-75 rounded-t-xl`}
                pointerEvents="none"
              >
                <PeachyGradient />
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
        </View>
        <MatchOfferButton matchId={match.offerId} matchOffer={onMatchPress} optionName={currentOptionName} />
      </GradientBorder>
    </View>
  )
}
