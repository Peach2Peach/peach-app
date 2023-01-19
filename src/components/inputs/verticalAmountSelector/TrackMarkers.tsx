import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { round } from '../../../utils/math'
import { Text } from '../../text'
import { KNOBHEIGHT } from './SliderKnob'

type TrackMarkersProps = {
  trackHeight: number
  labels?: Record<string, string>
}
export const TrackMarkers = ({ trackHeight, labels }: TrackMarkersProps) => (
  <View style={tw`absolute top-0 w-full`}>
    {Array.from({ length: Math.ceil(trackHeight / KNOBHEIGHT) }, (_, i) => (
      <View
        key={i}
        style={[
          tw`absolute left-1 right-1 h-[2px] bg-primary-mild-1 justify-center`,
          { top: (i + 1) * KNOBHEIGHT - KNOBHEIGHT / 2 - i },
        ]}
      >
        {!!labels && !!labels[i] && (
          <Text style={tw`absolute w-20 text-right subtitle-2 text-black-2 right-10`}>{labels[i]}</Text>
        )}
      </View>
    ))}
  </View>
)
