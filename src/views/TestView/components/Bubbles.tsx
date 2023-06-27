import { View } from 'react-native'
import { Text } from '../../../components'
import { MildBubble, PrimaryBubble } from '../../../components/bubble'
import tw from '../../../styles/tailwind'

export const Bubbles = () => (
  <View style={tw`flex flex-col items-center gap-2`}>
    <Text style={tw`h4`}>Bubbles</Text>
    <Text style={tw`h5`}>Primary bubble</Text>
    <PrimaryBubble>default</PrimaryBubble>
    <PrimaryBubble iconId="chevronsUp">icon</PrimaryBubble>
    <PrimaryBubble border>border</PrimaryBubble>
    <PrimaryBubble iconId="chevronsUp" border>
      icon + border
    </PrimaryBubble>
    <Text style={tw`h5`}>mild bubble</Text>
    <MildBubble>default</MildBubble>
    <MildBubble iconId="chevronsUp">icon</MildBubble>
    <MildBubble border>border</MildBubble>
    <MildBubble iconId="chevronsUp" border>
      icon + border
    </MildBubble>
  </View>
)
