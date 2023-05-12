import { ReactElement } from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon, Text } from '..'
import { FillProps } from 'react-native-svg'
import tw from '../../styles/tailwind'

type Props = ComponentProps & {
  checked: boolean
  onPress: () => void
  text?: string
  iconProps?: ComponentProps & { color: FillProps['fill'] }
}
export const Checkbox = ({ checked, iconProps, style, text, ...wrapperProps }: Props): ReactElement => (
  <TouchableOpacity {...wrapperProps} style={[style, tw`flex-row items-center`]}>
    <Icon
      id={checked ? 'checkboxMark' : 'square'}
      {...iconProps}
      color={checked ? tw.color('primary-main') : tw.color('black-3')}
    />
    {!!text && <Text style={[tw`pl-1 subtitle-1`, !checked && tw`text-black-4`]}>{text}</Text>}
  </TouchableOpacity>
)
