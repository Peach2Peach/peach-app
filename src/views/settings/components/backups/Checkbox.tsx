import React, { ReactElement } from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from '../../../../components'
import { FillProps } from 'react-native-svg'

type Props = ComponentProps & {
  checked: boolean
  onPress: () => void
  iconProps?: ComponentProps & { color: FillProps['fill'] }
}
export const Checkbox = ({ checked, iconProps, ...wrapperProps }: Props): ReactElement => (
  <TouchableOpacity {...wrapperProps}>
    <Icon id={checked ? 'checkboxMark' : 'square'} {...iconProps} />
  </TouchableOpacity>
)
