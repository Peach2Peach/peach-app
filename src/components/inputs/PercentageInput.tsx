import tw from '../../styles/tailwind'
import { TextInput, TextInputProps, View } from 'react-native'
import { Icon } from '../Icon'
import { enforceDecimalsFormat } from '../../utils/format'

type Props = Omit<TextInputProps, 'onChange'> & {
  onChange: (number: string) => void
}

export const PercentageInput = ({ onChange, ...props }: Props) => (
  <View
    style={tw`flex-row items-center px-2 py-3 border w-23 h-38px rounded-xl bg-primary-background-light border-black-2`}
  >
    <TextInput
      onChangeText={(text) => onChange(enforceDecimalsFormat(text, 2))}
      style={tw`flex-grow text-center input-text`}
      keyboardType={'decimal-pad'}
      placeholder={'20.00'}
      {...props}
    />
    <View style={tw`pb-1px`}>
      <Icon id="percent" size={20} color={tw`text-black-1`.color} />
    </View>
  </View>
)
