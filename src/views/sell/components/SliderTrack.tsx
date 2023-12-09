import { View } from 'react-native'
import tw from '../../../styles/tailwind'

type Props = {
  slider?: JSX.Element
  trackWidth: number
  paddingHorizontal?: number
}

export function SliderTrack ({ slider, trackWidth, paddingHorizontal }: Props) {
  return (
    <View
      style={[
        tw`flex-row items-center justify-between py-3 border rounded-2xl border-primary-mild-2`,
        { width: trackWidth, paddingHorizontal },
      ]}
    >
      <TrackMarker />
      <TrackMarker />
      <TrackMarker />
      <TrackMarker />
      <TrackMarker />

      {slider}
    </View>
  )
}

function TrackMarker () {
  return <View style={tw`h-1 w-2px rounded-px bg-primary-mild-2`} />
}
