import React from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'

export const Progress = ({ text, percentage, style }: { text?: string; percentage: number } & ComponentProps) => (
  <View style={style}>
    <View style={tw`h-2 overflow-hidden rounded-full bg-primary-background-dark`}>
      {percentage > 0 && (
        <View
          style={[
            tw`bg-primary-main h-[9px] rounded-full border border-primary-background`,
            { width: `${percentage * 100}%` },
          ]}
        />
      )}
    </View>
    {!!text && <Text style={tw`self-center mt-1 body-s text-black-2`}>{text}</Text>}
  </View>
)
