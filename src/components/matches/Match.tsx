import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Shadow, Text } from '..'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { dropShadowMild } from '../../utils/layout'
import { MatchOfferButton, UnmatchButton } from './buttons'
import { CurrencySelector, PaymentMethodSelector, PriceInfo, UserInfo, EscrowLink } from './components'

type MatchProps = ComponentProps & {
  match: Match
  renderShadow?: boolean
}

const onStartShouldSetResponder = () => true

export const Match = ({ match, style }: MatchProps): ReactElement => (
  <View {...{ onStartShouldSetResponder, style }}>
    <Shadow shadow={dropShadowMild}>
      <View style={tw`w-full rounded-xl bg-primary-background-light`}>
        {match.matched && (
          <View style={tw`absolute top-0 left-0 z-20 w-full h-full`}>
            <UnmatchButton match={match} />
            <View style={tw`w-full h-full bg-peach-translucent opacity-30`} />
            <Text style={tw`absolute w-full text-xs text-center bottom-full font-baloo text-peach-1`}>
              {i18n('search.matched')}
            </Text>
          </View>
        )}
        <View style={tw`px-5 pt-5 pb-6`}>
          <UserInfo user={match.user} />
          <PriceInfo match={match} />
          <CurrencySelector matchId={match.offerId} />
          <PaymentMethodSelector matchId={match.offerId} />
          <EscrowLink txId={match?.txId || '0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098'} />
        </View>
        <MatchOfferButton />
      </View>
    </Shadow>
  </View>
)

export default Match
