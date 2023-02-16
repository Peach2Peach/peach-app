import React, { ReactElement } from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from '..'
import { FillProps } from 'react-native-svg'
import tw from '../../styles/tailwind'

type Props = ComponentProps & {
  checked: boolean
  onPress: () => void
  iconProps?: ComponentProps & { color: FillProps['fill'] }
}
export const Checkbox = ({ checked, iconProps, ...wrapperProps }: Props): ReactElement => (
  <TouchableOpacity {...wrapperProps}>
    <Icon
      id={checked ? 'checkboxMark' : 'square'}
      {...iconProps}
      color={checked ? tw`text-primary-main`.color : tw`text-black-3`.color}
    />
  </TouchableOpacity>
)
