import { View } from 'react-native'
import tw from '../../../styles/tailwind'

type Props = {
  slider?: JSX.Element
  trackWidth: number
  paddingHorizontal?: number
  type?: 'sell' | 'buy'
}

export function SliderTrack ({ slider, trackWidth, paddingHorizontal, type = 'sell' }: Props) {
  const color = type === 'sell' ? tw.color('primary-mild-2') : tw.color('success-mild-2')
  return (
    <View
      style={[
        tw`flex-row items-center justify-between py-3 border rounded-2xl`,
        { width: trackWidth, paddingHorizontal, borderColor: color },
      ]}
    >
      <TrackMarker color={color} />
      <TrackMarker color={color} />
      <TrackMarker color={color} />
      <TrackMarker color={color} />
      <TrackMarker color={color} />

      {slider}
    </View>
  )
}

function TrackMarker ({ color }: { color: string | undefined }) {
  return <View style={[tw`h-1 w-2px rounded-px`, { backgroundColor: color }]} />
}
