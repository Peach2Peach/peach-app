import { Pressable, Text } from 'react-native'
import React from 'react'
import { Card } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type SettingsItemProps = {
  onPress: () => void
  title: string
}

const SettingsItem = ({ onPress, title }: SettingsItemProps) => (
  <Pressable style={tw`mt-2`} onPress={onPress}>
    <Card>
      <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n(`settings.${title}`)}</Text>
    </Card>
  </Pressable>
)

export default SettingsItem
