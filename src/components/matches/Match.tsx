import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Shadow, Text } from '..'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { mildShadow, mildShadowOrange } from '../../utils/layout'
import { MatchOfferButton, UnmatchButton } from './buttons'
import { CurrencySelector, PaymentMethodSelector, PriceInfo, UserInfo } from './components'

type MatchProps = ComponentProps & {
  match: Match
  renderShadow?: boolean
}

const onStartShouldSetResponder = () => true

export const Match = ({ match, style }: MatchProps): ReactElement => {
  const shadow = match.matched ? mildShadowOrange : mildShadow

  return (
    <View {...{ onStartShouldSetResponder, style }}>
      <Shadow shadow={shadow}>
        <View style={tw`w-full my-5 border rounded-xl border-grey-4`}>
          {match.matched && (
            <View style={tw`absolute top-0 left-0 z-20 w-full h-full`}>
              <UnmatchButton match={match} />
              <View style={tw`w-full h-full bg-peach-translucent opacity-30`} />
              <Text style={tw`absolute w-full text-xs text-center bottom-full font-baloo text-peach-1`}>
                {i18n('search.matched')}
              </Text>
            </View>
          )}
          <View style={tw`px-5 pt-5 pb-8`}>
            <UserInfo user={match.user} />
            <PriceInfo match={match} />
            <CurrencySelector matchId={match.offerId} />
            <PaymentMethodSelector matchId={match.offerId} />
          </View>
          <MatchOfferButton />
        </View>
      </Shadow>
    </View>
  )
}

export default Match
