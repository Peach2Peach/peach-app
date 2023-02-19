import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import { HorizontalLine } from '..'

import tw from '../../styles/tailwind'
import { peachyGradient } from '../../utils/layout'
import { isBuyOffer } from '../../utils/offer'
import { GradientBorder } from '../GradientBorder'
import { RadialGradient } from '../RadialGradient'
import { MatchOfferButton, UnmatchButton } from './buttons'
import { CurrencySelector, EscrowLink, PaymentMethodSelector, PriceInfo } from './components'
import { MatchCardCounterparty } from './components/UserInfo'
import { useInterruptibleFunction, useMatchOffer } from './hooks'
import { MatchPaymentDetails } from './MatchPaymentDetails'
import { Price } from './Price'

type MatchProps = ComponentProps & { match: Match; offer: BuyOffer | SellOffer }

export const Match = ({ match, offer }: MatchProps): ReactElement => {
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

  return (
    <View onStartShouldSetResponder={() => true} style={tw`flex-shrink`}>
      <GradientBorder
        gradient={peachyGradient}
        gradientBorderWidths={[4, 4, 0, 4]}
        defaultBorderWidths={[1, 1, 0, 1]}
        showBorder={showMatchedCard}
        containerStyle={[
          tw`flex-shrink overflow-hidden rounded-t-2xl`,
          !showMatchedCard && tw`border border-b-0 border-primary-main`,
        ]}
        style={tw`rounded-t-xl bg-primary-background-light`}
      >
        <>
          <View style={tw`p-4`}>
            <MatchCardCounterparty user={match.user} />
            <HorizontalLine style={tw`my-4 bg-black-5`} />

            {isBuyOffer(offer) ? (
              <>
                <PriceInfo match={match} />
                <CurrencySelector matchId={match.offerId} />
                <PaymentMethodSelector matchId={match.offerId} />
                <EscrowLink address={match.escrow || ''} />
              </>
            ) : (
              <>
                <HorizontalLine style={tw`bg-black-5`} />
                <Price match={match} fontStyle={tw`body-l`} isBuyOffer={false} style={tw`my-4`} />
                <HorizontalLine style={tw`bg-black-5`} />
                <MatchPaymentDetails match={match} />
              </>
            )}
          </View>
          {showMatchedCard && isBuyOffer(offer) && (
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
      <MatchOfferButton
        matchId={match.offerId}
        matchOffer={onMatchPress}
        offerId={offer.id}
        pretendIsMatched={showMatchedCard}
        isBuyOffer={isBuyOffer(offer)}
      />
    </View>
  )
}
