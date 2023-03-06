import React from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import { PrimaryButton } from '../../../components/buttons'
import tw from '../../../styles/tailwind'

export const PrimaryButtons = () => (
  <View style={tw`flex flex-col items-center`}>
    <Text style={tw`h2`}>Buttons</Text>
    <Text style={tw`h3`}>Primary</Text>
    <PrimaryButton style={tw`mt-2`} wide>
      Wide
    </PrimaryButton>
    <PrimaryButton style={tw`mt-2`} narrow>
      Narrow
    </PrimaryButton>
    <PrimaryButton style={tw`mt-2`}>Relative</PrimaryButton>
    <PrimaryButton style={tw`mt-2`} white>
      White
    </PrimaryButton>
    <PrimaryButton style={tw`mt-2`} border>
      Border
    </PrimaryButton>
    <PrimaryButton style={tw`mt-2`} white border>
      White Border
    </PrimaryButton>
    <PrimaryButton style={tw`mt-2`} disabled>
      Disabled
    </PrimaryButton>
    <PrimaryButton style={tw`mt-2`} border iconId="helpCircle">
      With Icon
    </PrimaryButton>
    <PrimaryButton style={tw`mt-2`} border iconId="helpCircle" loading>
      Loading
    </PrimaryButton>
    <PrimaryButton style={tw`mt-2`} white loading>
      Loading White
    </PrimaryButton>
    <PrimaryButton style={tw`mt-2`} white border loading>
      Loading White Border
    </PrimaryButton>
    <PrimaryButton style={tw`mt-2`} iconId="helpCircle" />
    <PrimaryButton style={tw`mt-2`} white iconId="helpCircle" />
    <PrimaryButton style={tw`mt-2`} border iconId="helpCircle" />
    <PrimaryButton style={tw`mt-2`} white border iconId="helpCircle" />
  </View>
)
