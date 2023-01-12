import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'

type BonusPointsBarProps = ComponentProps & {
  points: number
}

const BARLIMIT = 400

export const BonusPointsBar = ({ points, style }: BonusPointsBarProps): ReactElement => (
  <View>
    <View style={[tw`overflow-hidden rounded-full bg-peach-transparent`, style]}>
      <View
        style={[
          tw`h-4 -my-0.5 flex-row items-center max-w-full`,
          points < BARLIMIT * 0.04 ? tw`justify-start` : tw`justify-end border-2 rounded-full bg-peach-1 border-white-1`,
          { width: `${(points / BARLIMIT) * 100}%` },
        ]}
      >
        <Text
          style={[
            tw`text-xs -mt-0.5 mx-2`,
            points < BARLIMIT * 0.125 ? tw`absolute text-grey-1 left-full` : tw`text-white-1`,
          ]}
        >
          {points}
        </Text>
      </View>
    </View>
    <View style={tw`flex flex-row justify-between items-center mt-0.5`}>
      <View>{/* layout dummy */}</View>
      {[BARLIMIT * 0.25, BARLIMIT * 0.5, BARLIMIT * 0.75].map((marker) => (
        <View key={marker} style={tw`flex items-center w-0`}>
          <View style={tw`relative w-0 h-2 border border-grey-1 -left-px`} />
          <View style={tw`w-10`}>
            <Text style={tw`mt-1 text-xl text-center font-baloo text-grey-1 leading-xl`}>{marker}</Text>
          </View>
        </View>
      ))}
      <View>{/* layout dummy */}</View>
    </View>
  </View>
)
