import { LegacyRef, forwardRef } from 'react'
import { TextInput, TextInputProps, View } from 'react-native'
import tw from '../../styles/tailwind'
import { enforceDecimalsFormat } from '../../utils/format'
import { Icon } from '../Icon'

type Props = Omit<TextInputProps, 'onChange'> & {
  onChange: (number: string) => void
}

export const PercentageInput = forwardRef(({ onChange, ...props }: Props, ref: LegacyRef<TextInput> | undefined) => (
  <View
    style={[
      tw`flex-row items-center px-2 py-3 overflow-hidden w-23 h-38px rounded-xl`,
      tw`border bg-primary-background-light border-black-2`,
    ]}
  >
    <TextInput
      ref={ref}
      onChangeText={(text) => onChange(enforceDecimalsFormat(text, 2))}
      style={tw`grow py-0 text-center h-38px input-text text-black-1`}
      keyboardType={'decimal-pad'}
      placeholder={'20.00'}
      placeholderTextColor={tw.color('black-5')}
      {...props}
    />
    <View style={tw`pb-1px`}>
      <Icon id="percent" size={20} color={tw.color('black-1')} />
    </View>
  </View>
))
