import { View } from 'react-native'
import { CopyAble, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getInviteLink } from '../helpers/getInviteLink'
import { InviteFriendsButton } from './InviteFriendsButton'

type Props = {
  referralCode: string
}
export const ReferralCode = ({ referralCode }: Props) => {
  const inviteLink = getInviteLink(referralCode)

  return (
    <View style={tw`gap-4`}>
      <View style={tw`flex-row justify-between items-center border border-primary-main rounded-lg p-4`}>
        <View>
          <Text style={tw` body-m text-black-2`}>{i18n('referrals.inviteLink')}</Text>
          <Text style={tw`text-3xs`}>{inviteLink}</Text>
        </View>
        <CopyAble value={inviteLink} style={tw`w-7 h-7`} />
      </View>
      <InviteFriendsButton {...{ referralCode, inviteLink }} />
    </View>
  )
}
