import { View } from 'react-native'
import { Text } from '../../../../components'
import i18n from '../../../../utils/i18n'
import tw from '../../../../styles/tailwind'

type Props = {
  label: string
  fee: number
  isError?: boolean
}

export const FeeInfo = ({ label, fee, isError }: Props) => (
  <View>
    <Text style={tw`text-center text-black-2`}>{label}</Text>
    <Text style={[tw`text-center subtitle-1`, isError && tw`text-primary-main`]}>
      {fee} {i18n('satPerByte')}
    </Text>
  </View>
)
