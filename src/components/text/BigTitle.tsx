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
        tw`font-baloo text-center text-2xl leading-3xl uppercase text-peach-1 mt-3`,
        tw`font-baloo text-center text-3xl leading-4xl uppercase text-peach-1 mt-3`,
      ]}
    >
      {title}
    </Text>
  </View>
)

export default BigTitle
