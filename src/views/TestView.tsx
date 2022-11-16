import React from 'react'
import { View } from 'react-native'
import { Button } from '../components'
import tw from '../styles/tailwind'

export default () => (
  <View style={tw`flex w-full h-full justify-center items-center justify-between py-50`}>
    <Button>Default Button</Button>
    <Button info border>
      Info Button
    </Button>
    <Button disabled wide icon>
      Disabled and Wide
    </Button>
    <Button option>Option Button</Button>
    <Button icon />
  </View>
)
