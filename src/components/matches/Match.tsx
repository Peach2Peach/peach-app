import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import { HorizontalLine } from '..'

import tw from '../../styles/tailwind'
import { peachyGradient } from '../../utils/layout'
import { isBuyOffer } from '../../utils/offer'
import { GradientBorder } from '../../views/TestView/GradientBorder'
import { MatchOfferButton, UnmatchButton } from './buttons'
import { CurrencySelector, EscrowLink, PaymentMethodSelector, PriceInfo, UserInfo } from './components'
import { useInterruptibleFunction, useMatchOffer } from './hooks'
import { MatchPaymentDetails } from './MatchPaymentDetails'
import { Price } from './Price'

const { RadialGradient } = require('react-native-gradients')

type MatchProps = ComponentProps & { match: Match; offer: BuyOffer | SellOffer }

export const Match = ({ match, style, offer }: MatchProps): ReactElement => {
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
    <View onStartShouldSetResponder={() => true} style={style}>
      <GradientBorder
        gradient={peachyGradient}
        borderWidths={[4, 4, 0, 4]}
        showBorder={showMatchedCard}
        containerStyle={[tw`w-[313px] h-[414px] rounded-t-xl overflow-hidden`, !isBuyOffer(offer) && tw`h-64`]}
        style={tw`overflow-hidden rounded-t-xl bg-primary-background-light`}
        borderStyle={[tw`overflow-hidden rounded-t-2xl`, !showMatchedCard && tw`border border-b-0 border-primary-main`]}
      >
        <View style={tw`w-full`}>
          <View style={tw`px-5 pt-5 pb-6`}>
            <UserInfo user={match.user} style={tw`mb-5`} />
            {isBuyOffer(offer) ? (
              <>
                <PriceInfo match={match} />
                <CurrencySelector matchId={match.offerId} />
                <PaymentMethodSelector matchId={match.offerId} />
                <EscrowLink address={match.escrow || ''} />
              </>
            ) : (
              <>
                <HorizontalLine />
                <Price match={match} fontStyle={tw`body-l`} isBuyOffer={false} style={tw`my-4`} />
                <HorizontalLine />
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
        </View>
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
