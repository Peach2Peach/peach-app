import { View } from 'react-native'
import { Text } from '../../../components'
import { Bubble } from '../../../components/bubble'
import tw from '../../../styles/tailwind'

export const Bubbles = () => (
  <View style={tw`gap-2`}>
    <Text style={tw`h4 text-center`}>Bubbles</Text>
    <View style={tw`flex-row flex-wrap gap-y-4`}>
      <View style={tw`w-1/2 gap-2 px-2 items-center`}>
        <Text style={tw`subtitle-1`}>Primary bubble</Text>
        <Bubble color="primary">default</Bubble>
        <Bubble color="primary" iconId="chevronsUp">
          icon
        </Bubble>
        <Bubble color="primary" ghost>
          ghost
        </Bubble>
        <Bubble color="primary" iconId="chevronsUp" ghost>
          icon + ghost
        </Bubble>
      </View>
      <View style={tw`w-1/2 gap-2 px-2 items-center`}>
        <Text style={tw`subtitle-1`}>mild bubble</Text>
        <Bubble color="primary-mild">default</Bubble>
        <Bubble color="primary-mild" iconId="chevronsUp">
          icon
        </Bubble>
        <Bubble color="primary-mild" ghost>
          ghost
        </Bubble>
        <Bubble color="primary-mild" iconId="chevronsUp" ghost>
          icon + ghost
        </Bubble>
      </View>
      <View style={tw`w-1/2 gap-2 px-2 items-center`}>
        <Text style={tw`subtitle-1`}>gray bubble</Text>
        <Bubble color="gray">default</Bubble>
        <Bubble color="gray" iconId="chevronsUp">
          icon
        </Bubble>
        <Bubble color="gray" ghost>
          ghost
        </Bubble>
        <Bubble color="gray" iconId="chevronsUp" ghost>
          icon + ghost
        </Bubble>
      </View>
      <View style={tw`w-1/2 gap-2 px-2 items-center`}>
        <Text style={tw`subtitle-1`}>black bubble</Text>
        <Bubble color="black">default</Bubble>
        <Bubble color="black" iconId="chevronsUp">
          icon
        </Bubble>
        <Bubble color="black" ghost>
          ghost
        </Bubble>
        <Bubble color="black" iconId="chevronsUp" ghost>
          icon + ghost
        </Bubble>
      </View>
    </View>
  </View>
)
