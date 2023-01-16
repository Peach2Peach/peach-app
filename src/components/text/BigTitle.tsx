import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '.'
import tw from '../../styles/tailwind'
import Logo from '../../assets/logo/peachLogo.svg'

type BigTitle = {
  title: string
}

export const BigTitle = ({ title }: BigTitle): ReactElement => (
  <View style={tw`flex items-center`}>
    <Logo style={tw`w-40 h-40`} />
    <Text
      style={[
        tw`mt-3 text-2xl text-center uppercase font-baloo leading-3xl text-peach-1`,
        tw`mt-3 text-3xl text-center uppercase font-baloo leading-4xl text-peach-1`,
      ]}
    >
      {title}
    </Text>
  </View>
)

export default BigTitle
