import { View } from 'react-native'
import { CopyAble, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getInviteLink } from '../helpers/getInviteLink'
import { InviteFriendsButton } from './InviteFriendsButton'

type Props = {
  referralCode: string
}
const YourCode = ({ referralCode }: Props) => (
  <View>
    <Text style={tw`text-center body-m text-black-2`}>{i18n('referrals.yourCode')}</Text>
    <View style={tw`flex-row justify-center`}>
      <Text style={tw`mr-1 text-center h4`}>{referralCode}</Text>
      <CopyAble value={referralCode} style={tw`w-7 h-7`} />
    </View>
  </View>
)

const InviteLink = ({ inviteLink }: { inviteLink: string }) => (
  <View style={tw`flex-row justify-between items-center border border-primary-main rounded-lg p-4`}>
    <View>
      <Text style={tw` body-m text-black-2`}>{i18n('referrals.inviteLink')}</Text>
      <Text style={tw`text-3xs`}>{inviteLink.replace('https://', '')}</Text>
    </View>
    <CopyAble value={inviteLink} style={tw`w-7 h-7`} />
  </View>
)
export const ReferralCode = ({ referralCode }: Props) => {
  const inviteLink = getInviteLink(referralCode)

  return (
    <View style={tw`gap-4`}>
      <YourCode {...{ referralCode }} />
      <InviteLink {...{ inviteLink }} />
      <InviteFriendsButton {...{ referralCode, inviteLink }} />
    </View>
  )
}
