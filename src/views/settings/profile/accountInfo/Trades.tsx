import React from 'react'
import { View } from 'react-native'
import { Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const Trades = ({ trades, style }: { trades: number } & ComponentProps) => (
  <View style={style}>
    <Text style={tw`body-m text-black-2 lowercase`}>{i18n('profile.numberOfTrades')}:</Text>
    <Text style={tw`subtitle-1`}>{trades}</Text>
  </View>
)
