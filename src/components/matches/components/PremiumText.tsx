import React from 'react'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Text } from '../../text'

export const PremiumText = ({ premium }: { premium: number }) => (
  <Text style={tw`text-black-2`}>
    {' '}
    {premium === 0
      ? i18n('match.atMarketPrice')
      : i18n(premium > 0 ? 'match.premium' : 'match.discount', String(Math.abs(premium)))}
  </Text>
)
