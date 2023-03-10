import React from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { Text } from '../../text'
import { useKnobHeight } from './hooks/useKnobHeight'

export type TrackMarkersProps = {
  trackHeight: number
  labels?: Record<string, string>
}
export const TrackMarkers = ({ trackHeight, labels }: TrackMarkersProps) => {
  const knobHeight = useKnobHeight()
  return (
    <View style={tw`absolute top-0 w-full`}>
      {Array.from({ length: Math.ceil(trackHeight / knobHeight) }, (_, i) => (
        <View
          key={'trackMarker-' + i}
          style={[
            tw`absolute left-2 right-2 h-[2px] bg-primary-mild-1 justify-center rounded-full`,
            { top: (i + 1) * knobHeight - knobHeight / 2 - i },
          ]}
        >
          {!!labels && !!labels[i] && (
            <Text style={tw`absolute w-20 ml-5 subtitle-2 text-black-2 left-full`}>{labels[i]}</Text>
          )}
        </View>
      ))}
    </View>
  )
}
