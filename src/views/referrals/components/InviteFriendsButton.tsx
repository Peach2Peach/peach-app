import Share from 'react-native-share'
import { Button } from '../../../components/buttons/Button'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { info } from '../../../utils/log'

export const InviteFriendsButton = ({ referralCode, inviteLink }: { referralCode: string; inviteLink: string }) => {
  const inviteFriend = () => {
    Share.open({
      message: i18n('referrals.inviteText', referralCode, inviteLink),
    }).catch((e) => {
      info('User cancel invite friends share', e)
    })
  }
  return (
    <Button style={tw`self-center`} textColor={tw`text-primary-main`} ghost onPress={inviteFriend}>
      {i18n('referrals.inviteFriends')}
    </Button>
  )
}
