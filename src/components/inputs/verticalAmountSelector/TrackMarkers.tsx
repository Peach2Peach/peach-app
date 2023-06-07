import { View } from 'react-native'
import tw from '../../../styles/tailwind'

const count = 9
export const TrackMarkers = () => (
  <View style={tw`absolute top-0 w-full h-full`}>
    {Array.from({ length: count }, (_, i) => (
      <View
        key={`trackMarker-${i}`}
        style={[
          tw`absolute left-2 right-2 h-[2px] bg-primary-mild-1 justify-center rounded-full`,
          { top: `${((i + 0.5) / count) * 100}%` },
        ]}
      ></View>
    ))}
  </View>
)
