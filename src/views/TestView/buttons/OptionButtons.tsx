import { View } from 'react-native'
import { Text } from '../../../components'
import { OptionButton } from '../../../components/buttons'
import tw from '../../../styles/tailwind'

export const OptionButtons = () => (
  <View style={tw`flex flex-col items-center`}>
    <Text style={tw`mt-4 h3`}>Option</Text>
    <OptionButton style={tw`mt-2`} wide>
      Wide
    </OptionButton>
    <OptionButton style={tw`mt-2`} narrow>
      Narrow
    </OptionButton>
    <OptionButton style={tw`mt-2`}>Relative</OptionButton>
    <OptionButton style={tw`mt-2`} disabled>
      Disabled
    </OptionButton>
    <OptionButton style={tw`mt-2`} iconId="helpCircle">
      With Icon
    </OptionButton>
    <OptionButton style={tw`mt-2`} iconId="helpCircle" loading>
      Loading
    </OptionButton>
    <OptionButton style={tw`mt-2`} iconId="helpCircle" />
  </View>
)
