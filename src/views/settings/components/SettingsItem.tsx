import { Pressable } from 'react-native'
import React from 'react'
import { Card, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useNavigation } from '../../../hooks'

export type SettingsItemProps =
  | { title: ScreenWithoutProps; onPress?: undefined; condition?: boolean; icon?: JSX.Element }
  | {
      onPress: () => void
      title: string
      condition?: boolean
      icon?: JSX.Element
    }

export const SettingsItem = ({ onPress: pressAction, title, icon, condition }: SettingsItemProps) => {
  const navigation = useNavigation()
  const onPress = pressAction ? pressAction : () => navigation.navigate(title)

  return (
    <Pressable style={tw`mt-2`} onPress={onPress}>
      <Card style={tw`flex-row items-center justify-center`}>
        <Text style={tw`text-center text-lg text-black-1 p-2`}>
          {i18n(`settings.${title}`)}
          {condition !== undefined && (
            <>
              <Text style={!!condition && tw`text-peach-1 font-bold`}> {i18n('settings.on')} </Text>/
              <Text style={!condition && tw`text-peach-1 font-bold`}> {i18n('settings.off')}</Text>
            </>
          )}
        </Text>
        {!!icon && icon}
      </Card>
    </Pressable>
  )
}
