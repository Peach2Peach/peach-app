import { View } from 'react-native'
import { Text } from '../../../components'
import { PrimaryBubble } from '../../../components/bubble'
import tw from '../../../styles/tailwind'

export const Bubbles = () => (
  <View style={tw`flex flex-col items-center gap-2`}>
    <Text style={tw`mt-4 h4`}>Bubbles</Text>
    <PrimaryBubble>default</PrimaryBubble>
    <PrimaryBubble iconId="chevronsUp">icon</PrimaryBubble>
    <PrimaryBubble border>border</PrimaryBubble>
    <PrimaryBubble iconId="chevronsUp" border>
      icon + border
    </PrimaryBubble>
  </View>
)
