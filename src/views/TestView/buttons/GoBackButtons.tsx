import React from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import { GoBackButton } from '../../../components/buttons'
import tw from '../../../styles/tailwind'

export const GoBackButtons = () => (
  <View style={tw`flex flex-col items-center`}>
    <Text style={tw`mt-4 h3`}>Go back</Text>
    <GoBackButton style={tw`mt-2`} wide />
    <GoBackButton style={tw`mt-2`} narrow />
    <GoBackButton style={tw`mt-2`} />
    <GoBackButton style={tw`mt-2`} white />
    <GoBackButton style={tw`mt-2`} border />
    <GoBackButton style={tw`mt-2`} white border />
    <GoBackButton style={tw`mt-2`} disabled />
    <GoBackButton style={tw`mt-2`} border iconId="helpCircle" />
    <GoBackButton style={tw`mt-2`} border iconId="helpCircle" loading />
    <GoBackButton style={tw`mt-2`} iconId="helpCircle" />
  </View>
)
