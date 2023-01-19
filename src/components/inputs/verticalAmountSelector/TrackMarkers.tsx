import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { round } from '../../../utils/math'

type TrackMarkersProps = {
  trackHeight: number
}
export const TrackMarkers = ({ trackHeight }: TrackMarkersProps) => (
  <View style={tw`absolute top-0 w-full`}>
    {Array.from({ length: 9 }, (_, i) => (
      <View
        key={i}
        style={[tw`absolute left-1 right-1 h-[2px] bg-primary-mild-1`, { top: round((trackHeight / 9) * (i + 1)) }]}
      />
    ))}
  </View>
)
