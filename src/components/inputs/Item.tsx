import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../text'

type ItemProps = ComponentProps & {
  label: string,
  isSelected: boolean,
  onPress: () => void,
}
export const Item = ({
  label,
  isSelected,
  onPress,
  style,
}: ItemProps): ReactElement => {
  const bgColor = isSelected ? tw`bg-peach-1` : {}
  const borderColor = isSelected ? tw`border-peach-1` : tw`border-grey-2`
  const textColor = isSelected ? tw`text-white-1` : tw`text-grey-2`

  return <Pressable
    onPress={onPress}
    style={[
      tw`h-8 px-2 flex justify-center border border-grey-3 rounded`,
      bgColor, borderColor,
      style
    ]}>
    <Text style={[
      tw`font-baloo text-xs leading-5 text-center`,
      textColor,
    ]}>
      {label}
    </Text>
  </Pressable>
}