import { TouchableOpacity, View, ViewStyle } from 'react-native'
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
) & { iconId?: IconType; iconSize?: ViewStyle; warning?: boolean; enabled?: boolean }

export const SettingsItem = ({ onPress: pressAction, title, iconId, warning, enabled, iconSize }: SettingsItemProps) => {
  const navigation = useNavigation()
  const onPress = pressAction ? pressAction : () => navigation.navigate(title)
  const iconColor = warning ? tw.color('error-main') : enabled ? tw.color('primary-main') : tw.color('black-3')

  return (
    <TouchableOpacity style={tw`my-3 mx-[6px] justify-between items-center flex-row`} onPress={onPress}>
      <Text style={[tw`settings text-black-2`, warning && tw`text-error-main`]}>{i18n(`settings.${title}`)}</Text>
      <View style={tw`flex items-center w-8 h-8`}>
        <Icon id={iconId || 'chevronRight'} style={iconSize || tw`w-8 h-8`} color={iconColor} />
      </View>
    </TouchableOpacity>
  )
}
