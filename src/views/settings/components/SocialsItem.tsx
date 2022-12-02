import React from 'react'
import { Text, Pressable } from 'react-native'
import { Card, Icon } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type SocialsItemProps = {
  onPress: () => void
  title: string
}

const SocialsItem = ({ onPress, title }: SocialsItemProps) => (
  <Pressable onPress={onPress} style={title !== 'twitter' && tw`mt-2`}>
    <Card style={tw`flex-row items-center justify-center`}>
      <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n(title)}</Text>
      <Icon id="link" style={tw`w-3 h-3`} color={tw`text-grey-2`.color} />
    </Card>
  </Pressable>
)

export default SocialsItem
