
import React, { ReactElement } from 'react'
import {
  View,
} from 'react-native'
import { Text } from '.'
import tw from '../../styles/tailwind'
import { padString } from '../../utils/stringUtils'

interface SatsFormat {
  sats: number
}

/**
 * @description Component to display formatted sats
 * @param props Component properties
 * @param props.sats satoshis
 * @example
 * <SatsFormat sats={5000}/>
 */
export const SatsFormat = ({ sats }: SatsFormat): ReactElement => {
  const satsString = String(sats / 100000000)

  let [btc, sat] = satsString.split('.')

  sat = padString({
    string: sat,
    length: 8,
    char: '0',
    side: 'right'
  })

  return <View style={tw`flex-row justify-start items-center`}>
    <Text style={tw`font-mono text-grey-2`}>{btc}.{sat.slice(0, 2)}</Text>
    <Text style={tw`font-mono`}> {sat.slice(2, -3)} {sat.slice(-3, sat.length)} Sat</Text>
  </View>
}

export default SatsFormat
