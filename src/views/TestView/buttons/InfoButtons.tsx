import React from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import { InfoButton } from '../../../components/buttons'
import tw from '../../../styles/tailwind'

export const InfoButtons = () => (
  <View style={tw`flex flex-col items-center`}>
    <Text style={tw`mt-4 h3`}>Info</Text>
    <InfoButton style={tw`mt-2`} wide>
      Wide
    </InfoButton>
    <InfoButton style={tw`mt-2`} narrow>
      Narrow
    </InfoButton>
    <InfoButton style={tw`mt-2`}>Relative</InfoButton>
    <InfoButton style={tw`mt-2`} white>
      White
    </InfoButton>
    <InfoButton style={tw`mt-2`} border>
      Border
    </InfoButton>
    <InfoButton style={tw`mt-2`} white border>
      White Border
    </InfoButton>
    <InfoButton style={tw`mt-2`} disabled>
      Disabled
    </InfoButton>
    <InfoButton style={tw`mt-2`} border iconId="helpCircle">
      With Icon
    </InfoButton>
    <InfoButton style={tw`mt-2`} border iconId="helpCircle" loading>
      Loading
    </InfoButton>
    <InfoButton style={tw`mt-2`} iconId="helpCircle" />
  </View>
)
