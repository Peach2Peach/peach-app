import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Text } from '.'
import tw from '../styles/tailwind'
import { IconType } from '../assets/icons'

type HintProps = ComponentProps & {
  title: string
  text: string
  icon: IconType
  onPress: () => void
  onDismiss?: () => void
}

export const Hint = ({ title, text, icon, onPress, onDismiss, style }: HintProps): ReactElement => (
  <View style={[tw`rounded-lg flex flex-row border border-grey-3 p-4`, style]}>
    <Pressable onPress={onPress} style={tw`flex flex-row flex-shrink justify-center`}>
      <View style={tw`w-7 flex-shrink-0`}>
        <Icon id={icon} style={tw`w-7 h-7 flex-shrink-0`} color={tw`text-red`.color} />
      </View>
      <View style={tw`ml-4 w-full flex-shrink`}>
        <Text style={tw`text-base text-red`}>{title}</Text>
        <Text style={tw`text-sm`}>{text}</Text>
      </View>
    </Pressable>
    {onDismiss ? (
      <Pressable onPress={onDismiss} style={tw`w-7 flex-shrink-0`}>
        <Icon id="x" style={tw`w-7 h-7`} color={tw`text-grey-3`.color} />
      </Pressable>
    ) : null}
  </View>
)

export default Hint
