import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'

type BonusPointsBarProps = ComponentProps & {
  points: number
}

const BARLIMIT = 400

export const BonusPointsBar = ({ points, style }: BonusPointsBarProps): ReactElement =>
  <View>
    <View style={[tw`bg-peach-transparent overflow-hidden rounded-full`, style]}>
      <View style={[
        tw`h-4 -my-0.5 flex-row items-center max-w-full`,
        points < BARLIMIT * 0.04
          ? tw`justify-start`
          : tw`bg-peach-1 rounded-full justify-end border-2 border-white-1`,
        { width: `${points / BARLIMIT * 100}%` }
      ]}>
        <Text style={[
          tw`text-xs -mt-0.5 mx-2`,
          points < BARLIMIT * 0.125 ? tw`text-grey-1 absolute left-full` : tw`text-white-1`,
        ]}>{points}</Text>
      </View>
    </View>
    <View style={tw`flex flex-row justify-between items-center mt-0.5`}>
      <View>{/* layout dummy */}</View>
      {[BARLIMIT * 0.25, BARLIMIT * 0.5, BARLIMIT * 0.75].map(marker => <View style={tw`w-0 flex items-center`}>
        <View style={tw`h-2 w-0 border border-grey-1 relative -left-px`} />
        <View style={tw`w-10`}>
          <Text style={tw`font-baloo text-grey-1 text-xl leading-xl text-center mt-1`}>{marker}</Text>
        </View>
      </View>)}
      <View>{/* layout dummy */}</View>
    </View>
  </View>
