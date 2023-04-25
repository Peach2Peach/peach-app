import { View } from 'react-native'
import { Text } from '../..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { CopyAble } from '../../ui'

type Props = ComponentProps & {
  reference?: string
  copyable?: boolean
  disputeActive?: boolean
}

export const PaymentReference = ({ reference, copyable, style, disputeActive }: Props) => (
  <View style={[tw`flex-row items-center`, style]}>
    <Text style={[tw`text-black-2 w-25`, disputeActive && tw`text-error-light`]}>
      {i18n('contract.summary.reference')}
    </Text>
    <View style={[tw`flex-row items-center`, !reference && tw`opacity-50`]}>
      <Text style={[tw`subtitle-1 leading-base`, !!disputeActive && tw`text-error-dark`]}>
        {reference || i18n('none')}
      </Text>
      {copyable && (
        <CopyAble value={reference} style={tw`ml-2`} color={!!disputeActive ? tw`text-error-main` : undefined} />
      )}
    </View>
  </View>
)
