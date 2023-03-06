import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { Loading } from '../../components'

export default (): ReactElement => (
  <View style={tw`h-full flex justify-center items-center`}>
    <Loading />
  </View>
)
