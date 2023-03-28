import { View } from 'react-native'
import { Text } from '../../../components'
import { WarningButton } from '../../../components/buttons'
import tw from '../../../styles/tailwind'

export const WarningButtons = () => (
  <View style={tw`flex flex-col items-center`}>
    <Text style={tw`mt-4 h3`}>Warning</Text>
    <WarningButton style={tw`mt-2`} wide>
      Wide
    </WarningButton>
    <WarningButton style={tw`mt-2`} narrow>
      Narrow
    </WarningButton>
    <WarningButton style={tw`mt-2`}>Relative</WarningButton>
    <WarningButton style={tw`mt-2`} disabled>
      Disabled
    </WarningButton>
    <WarningButton style={tw`mt-2`} iconId="helpCircle">
      With Icon
    </WarningButton>
    <WarningButton style={tw`mt-2`} iconId="helpCircle" loading>
      Loading
    </WarningButton>
    <WarningButton style={tw`mt-2`} iconId="helpCircle" />
  </View>
)
