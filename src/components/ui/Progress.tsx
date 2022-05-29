import React, { ReactElement } from 'react'
import { Text } from '../text'
import tw from '../../styles/tailwind'
import { View } from 'react-native'
import { textShadow } from '../../utils/layout'

type ProgressProps = ComponentProps & {
  percent: number,
  text?: string,
}
export const Progress = ({ percent, text, style }: ProgressProps): ReactElement =>
  <View style={[tw`h-4 bg-peach-transparent overflow-hidden`, style]}>
    <View style={[tw`h-full bg-peach-1`, { width: `${percent * 100}%` }]}/>
    {text
      ? <View style={tw`absolute w-full`}>
        <Text style={[tw`text-sm font-baloo text-white-2 text-center uppercase -mt-px`, textShadow]}>
          {text}
        </Text>
      </View>
      : null
    }
  </View>

export default Progress