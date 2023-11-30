import { TextStyle, TouchableOpacity } from 'react-native'
import { Icon, Loading, Text } from '..'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export type PopupActionProps = ComponentProps & {
  onPress: (() => void) | (() => Promise<void>) | undefined
  label: string | undefined
  iconId: IconType
  reverseOrder?: boolean
  textStyle?: TextStyle
  loading?: boolean
  disabled?: boolean
}
export const PopupAction = ({
  onPress,
  label,
  iconId,
  reverseOrder,
  style,
  textStyle,
  loading,
  disabled,
}: PopupActionProps) => (
  <TouchableOpacity
    style={[
      tw`flex-row items-center flex-grow gap-1 px-6 py-2`,
      disabled && tw`opacity-50`,
      reverseOrder && tw`flex-row-reverse`,
      style,
    ]}
    onPress={onPress}
    disabled={loading || disabled}
  >
    {loading ? (
      <Loading color={tw.color('primary-background-light')} style={tw`w-4 h-4`} />
    ) : (
      <Icon id={iconId} color={textStyle?.color ?? tw.color('primary-background-light')} size={16} />
    )}
    <Text style={[tw`subtitle-1 text-primary-background-light`, textStyle]}>{loading ? i18n('loading') : label}</Text>
  </TouchableOpacity>
)
