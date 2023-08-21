import Share from 'react-native-share'
import { PrimaryButton } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { info } from '../../../utils/log'

export const InviteFriendsButton = ({ referralCode, inviteLink }: { referralCode: string; inviteLink: string }) => {
  const inviteFriend = () => {
    Share.open({
      message: i18n('referrals.inviteText', referralCode, inviteLink),
      url: inviteLink,
    }).catch((e) => {
      info('User cancel invite friends share', e)
    })
  }
  return (
    <PrimaryButton style={tw`self-center`} border onPress={inviteFriend}>
      {i18n('referrals.inviteFriends')}
    </PrimaryButton>
  )
}
