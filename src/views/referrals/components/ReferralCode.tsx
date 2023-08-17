import { View } from 'react-native'
import Share from 'react-native-share'
import { CopyAble, PrimaryButton, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

const getInviteLink = (code: string) => `peachbitcoin.com/referral?code=${code}`
type Props = {
  referralCode: string
}
export const ReferralCode = ({ referralCode }: Props) => {
  const inviteLink = getInviteLink(referralCode)
  const inviteFriend = () => {
    Share.open({
      message: i18n('referrals.inviteText', referralCode, inviteLink),
      url: inviteLink,
    }).catch(() => {})
  }
  return (
    <View style={tw`gap-4`}>
      <View style={tw`flex-row justify-between items-center border border-primary-main rounded-lg p-4`}>
        <View>
          <Text style={tw` body-m text-black-2`}>{i18n('referrals.inviteLink')}</Text>
          <Text style={tw`text-3xs`}>{inviteLink}</Text>
        </View>
        <CopyAble value={inviteLink} style={tw`w-7 h-7`} />
      </View>
      <PrimaryButton style={tw`self-center`} border onPress={inviteFriend}>
        {i18n('referrals.inviteFriends')}
      </PrimaryButton>
    </View>
  )
}
