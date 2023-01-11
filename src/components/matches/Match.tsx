import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Shadow, Text } from '..'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { mildShadow, mildShadowOrange, noShadow } from '../../utils/layout'
import { UnmatchButton } from './buttons'
import { CurrencySelector, PaymentMethodSelector, PriceInfo, UserInfo } from './components'

type MatchProps = ComponentProps & {
  match: Match
  renderShadow?: boolean
}

export const Match = ({ match, renderShadow }: MatchProps): ReactElement => {
  const shadow = renderShadow ? (match.matched ? mildShadowOrange : mildShadow) : noShadow

  return (
    <Shadow shadow={shadow}>
      <View
        style={[tw`w-full my-5 border rounded-md border-grey-4 bg-white-1`, match.matched ? tw`border-peach-1` : {}]}
      >
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
      </View>
    </Shadow>
  )
}

export default Match
