import React, { ReactElement } from 'react'
import { TextStyle, View } from 'react-native'
import { Text } from '.'
import { SATSINBTC } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { padString } from '../../utils/string'

type SatsFormat = ComponentProps & {
  sats: number
  format?: 'inline' | 'big'
  color?: TextStyle
}

/**
 * @description Component to display formatted sats
 * @param props Component properties
 * @param props.sats satoshis
 * @param props.color sats color
 * @example
 * <SatsFormat sats={5000}/>
 */
export const SatsFormat = ({ sats, format = 'inline', color, style }: SatsFormat): ReactElement => {
  const satsString = String(sats)
  let btc = '0'
  let sat = satsString.slice(-8, satsString.length)

  if (sats >= SATSINBTC) {
    btc = satsString.slice(0, -8)
  }

  sat = padString({
    string: sat,
    length: 8,
    char: '0',
    side: 'left',
  })

  const finalString = `${btc}.${sat.slice(-8, -6)} ${sat.slice(-6, -3)} ${sat.slice(-3, sat.length)}`
  const cutIndex
    = satsString.length < 3
      ? finalString.length - satsString.length
      : satsString.length < 6
        ? finalString.length - satsString.length - 1
        : satsString.length < 9
          ? finalString.length - satsString.length - 2
          : 0
  return format === 'inline' ? (
    <Text>
      <Text style={[tw`text-black-6`, style]}>{finalString.slice(0, cutIndex)}</Text>
      <Text style={[color || tw`text-black-1`, style]}>
        {finalString.slice(cutIndex, finalString.length)} {i18n('currency.SATS')}
      </Text>
    </Text>
  ) : (
    <View style={[tw`flex-row justify-start items-center`, style]}>
      <Text style={tw`font-mono text-grey-3`}>{finalString.slice(0, cutIndex)}</Text>
      <Text style={tw`font-mono text-black-1`}>
        {finalString.slice(cutIndex, finalString.length)} {i18n('currency.SATS')}
      </Text>
    </View>
  )
}

export default SatsFormat
