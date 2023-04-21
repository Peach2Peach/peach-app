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
  disputeActive?: boolean
}

export const InfoBlock = ({ value, name, copyable, onInfoPress, disputeActive, style }: Props) => (
  <View style={[tw`flex-row`, style]}>
    <View style={tw`w-25`}>
      {!!name && <Text style={!disputeActive ? tw`text-black-2` : tw`text-error-light`}>{i18n(name)}</Text>}
    </View>
    <View key={'paymentDetails-' + name} style={tw`flex-row items-center flex-1`}>
      <Text
        onPress={!!onInfoPress ? onInfoPress : undefined}
        style={[tw`flex-wrap subtitle-1 leading-base`, !!disputeActive && tw`text-error-dark`]}
      >
        {value}
      </Text>
      {copyable && (
        <View style={tw`w-6 h-4 ml-2`}>
          <CopyAble value={value} color={!!disputeActive ? tw`text-error-main` : undefined} />
        </View>
      )}
    </View>
  </View>
)
