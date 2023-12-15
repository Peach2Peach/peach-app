import { TouchableOpacity } from 'react-native'
import { FillProps } from 'react-native-svg'
import tw from '../../styles/tailwind'
import { Icon } from '../Icon'
import { PeachText } from '../text/PeachText'

type Props = ComponentProps & {
  checked: boolean
  onPress: () => void
  text?: string
  iconProps?: ComponentProps & { color: FillProps['fill'] }
  green?: boolean
}
export const Checkbox = ({ checked, green, iconProps, style, text, ...wrapperProps }: Props) => (
  <TouchableOpacity {...wrapperProps} style={[style, tw`flex-row items-center gap-1`]}>
    <Icon
      id={checked ? 'checkboxMark' : 'square'}
      {...iconProps}
      color={checked ? tw.color(green ? 'success-main' : 'primary-main') : tw.color('black-3')}
    />
    {!!text && <PeachText style={[tw`subtitle-1`, !checked && tw`text-black-4`]}>{text}</PeachText>}
  </TouchableOpacity>
)
