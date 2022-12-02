import React from 'react'
import { View } from 'react-native'

import { PrimaryButton } from '../components/buttons'
import tw from '../styles/tailwind'

export default () => (
  <View style={tw`flex w-full h-full justify-center items-center justify-evenly bg-[#FEEDe5]`}>
    <PrimaryButton wide>Wide</PrimaryButton>
    <PrimaryButton narrow>Narrow</PrimaryButton>
    <PrimaryButton>Relative</PrimaryButton>
    <PrimaryButton white>White</PrimaryButton>
    <PrimaryButton border>Border</PrimaryButton>
    <PrimaryButton white border>
      White Border
    </PrimaryButton>
    <PrimaryButton disabled>Disabled</PrimaryButton>
    <PrimaryButton border iconId="helpCircle">
      With Icon
    </PrimaryButton>
    <PrimaryButton border iconId="helpCircle" loading>
      Loading
    </PrimaryButton>
    <PrimaryButton iconId="helpCircle" />
  </View>
)
