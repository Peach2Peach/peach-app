import { View } from 'react-native'
import { CopyAble, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type Props = {
  referralCode: string
}
export const ReferralCode = ({ referralCode }: Props) => (
  <>
    <Text style={tw`text-center body-m text-black-2`}>{i18n('referrals.yourCode')}</Text>
    <View style={tw`flex-row justify-center`}>
      <Text style={tw`mr-1 text-center h4`}>{referralCode}</Text>
      <CopyAble value={referralCode} style={tw`w-7 h-7`} />
    </View>
  </>
)
