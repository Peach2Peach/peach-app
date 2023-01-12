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
  <View style={[tw`flex flex-row p-4 border rounded-lg border-grey-3`, style]}>
    <Pressable onPress={onPress} style={tw`flex flex-row justify-center flex-shrink`}>
      <View style={tw`flex-shrink-0 w-7`}>
        <Icon id={icon} style={tw`flex-shrink-0 w-7 h-7`} color={tw`text-red`.color} />
      </View>
      <View style={tw`flex-shrink w-full ml-4`}>
        <Text style={tw`text-base text-red`}>{title}</Text>
        <Text style={tw`text-sm`}>{text}</Text>
      </View>
    </Pressable>
    {onDismiss ? (
      <Pressable onPress={onDismiss} style={tw`flex-shrink-0 w-7`}>
        <Icon id="x" style={tw`w-7 h-7`} color={tw`text-grey-3`.color} />
      </Pressable>
    ) : null}
  </View>
)

export default Hint
