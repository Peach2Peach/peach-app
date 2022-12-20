import { Pressable } from 'react-native'
import React from 'react'
import { Icon, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useNavigation } from '../../../hooks'
import { IconType } from '../../../assets/icons'

export type SettingsItemProps = (
  | { title: ScreenWithoutProps; onPress?: undefined }
  | {
      onPress: () => void
      title: string
    }
) & { iconId?: IconType; warning?: boolean; enabled?: boolean }

export const SettingsItem = ({ onPress: pressAction, title, iconId, warning, enabled }: SettingsItemProps) => {
  const navigation = useNavigation()
  const onPress = pressAction ? pressAction : () => navigation.navigate(title)
  const iconColor = warning ? tw`text-error-main`.color : enabled ? tw`text-primary-main`.color : tw`text-black-3`.color

  return (
    <Pressable style={tw`my-3 mx-[6px] justify-between items-center flex-row`} onPress={onPress}>
      <Text style={[tw`h6 lowercase text-black-2`, warning && tw`text-error-main`]}>{i18n(`settings.${title}`)}</Text>
      <Icon id={iconId || 'chevronRight'} style={tw`w-8 h-8`} color={iconColor} />
    </Pressable>
  )
}
