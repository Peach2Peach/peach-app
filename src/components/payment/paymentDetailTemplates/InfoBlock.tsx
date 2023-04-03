import { View } from 'react-native'
import { Text } from '../..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { CopyAble } from '../../ui'

type Props = ComponentProps & {
  value: string
  name?: string
  copyable?: boolean
  onInfoPress?: () => void
}

export const InfoBlock = ({ value, name, copyable, onInfoPress, style }: Props) => (
  <View style={[tw`flex-row`, style]}>
    <View style={tw`w-25`}>{!!name && <Text style={tw`text-black-2`}>{i18n(name)}</Text>}</View>
    <View key={'paymentDetails-' + name} style={tw`flex-row items-center flex-1`}>
      <Text onPress={!!onInfoPress ? onInfoPress : undefined} style={tw`flex-wrap subtitle-1 leading-base`}>
        {value}
      </Text>
      {copyable && (
        <View style={tw`w-6 h-4 ml-2`}>
          <CopyAble value={value} />
        </View>
      )}
    </View>
  </View>
)
