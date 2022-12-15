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

/**
 * @description Component to display a match
 * @param match the match
 * @param renderShadow wetheror not a shadow should be rendered
 * @example
 * <Match match={match} renderShadow />
 */
export const Match = ({ match, renderShadow }: MatchProps): ReactElement => {
  const shadow = renderShadow ? (match.matched ? mildShadowOrange : mildShadow) : noShadow

  return (
    <Shadow shadow={shadow}>
      <View
        style={[tw`w-full border border-grey-4 bg-white-1 rounded-md my-5`, match.matched ? tw`border-peach-1` : {}]}
      >
        {match.matched && (
          <View style={tw`absolute top-0 left-0 w-full h-full z-20`}>
            <UnmatchButton match={match} />
            <View style={tw`w-full h-full bg-peach-translucent opacity-30`} />
            <Text style={tw`absolute bottom-full w-full text-center font-baloo text-peach-1 text-xs`}>
              {i18n('search.matched')}
            </Text>
          </View>
        )}
        <View style={tw`px-5 pt-5 pb-8`}>
          <UserInfo match={match} />
          <PriceInfo match={match} />
          <CurrencySelector />
          <PaymentMethodSelector />
        </View>
      </View>
    </Shadow>
  )
}

export default Match
