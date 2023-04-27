import { View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '../text'

export const DisputeStatus = () => (
  <>
    <View style={tw`flex-row items-center my-2`}>
      <Text style={tw`text-black-3 w-18`}>status</Text>
      <Text style={tw`mx-2 subtitle-2`}>dispute won</Text>
      <Icon id="checkCircle" color={tw`text-success-main`.color} style={tw`w-4 h-4`} />
    </View>
    <Text style={tw`body-s`}>
      You won the dispute! The buyer's reputation has been impacted. You can now either re-publish the offer or get
      refunded.
    </Text>
  </>
)
