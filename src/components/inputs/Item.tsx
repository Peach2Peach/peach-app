import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../text'

type ItemProps = ComponentProps & {
  label: string,
  isSelected: boolean,
  onPress: () => void,
  invertColors?: boolean,
}
export const Item = ({
  label,
  isSelected,
  onPress,
  style,
  invertColors
}: ItemProps): ReactElement => {
  const bgColor = invertColors
    ? isSelected ? tw`bg-white-1` : {}
    : isSelected ? tw`bg-peach-1` : {}
  const borderColor = invertColors
    ? tw`border-white-1`
    : tw`border-peach-1`
  const textColor = invertColors
    ? isSelected ? tw`text-peach-1` : tw`text-white-1`
    : isSelected ? tw`text-white-1` : tw`text-peach-1`

  return <Pressable
    onPress={onPress}
    style={[
      tw`h-8 px-2 flex justify-center border border-grey-3 rounded`,
      bgColor, borderColor,
      style
    ]}>
    <Text style={[
      tw`font-baloo text-xs leading-6 text-center`,
      textColor,
    ]}>
      {label}
    </Text>
  </Pressable>
}