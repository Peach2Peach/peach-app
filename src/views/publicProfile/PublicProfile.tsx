import { View, ViewStyle } from 'react-native'
import { Screen } from '../../components'
import { TouchableRedText } from '../../components/text/TouchableRedText'
import { useRoute } from '../../hooks'
import { useUser } from '../../hooks/query/useUserQuery'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { AccountInfo } from '../settings/profile/accountInfo/AccountInfo'
import { ProfileOverview } from './components'
import { useBlockUser } from './useBlockUser'
import { useUnblockUser } from './useUnblockUser'
import { useUserStatus } from './useUserStatus'

export const PublicProfile = () => {
  const { userId } = useRoute<'publicProfile'>().params
  const { user, isLoading } = useUser(userId)
  if (isLoading || !user) return <></>

  return (
    <Screen header={i18n('profile.user.title')}>
      <View style={tw`gap-12 grow`}>
        <ProfileOverview user={user} />
        <AccountInfo user={user} />
      </View>
      <BlockUser style={tw`self-center`} />
    </Screen>
  )
}

function BlockUser ({ style }: { style?: ViewStyle }) {
  const { userId } = useRoute<'publicProfile'>().params
  const { data } = useUserStatus(userId)

  const { mutate: blockUser } = useBlockUser(userId)
  const { mutate: unblockUser } = useUnblockUser(userId)
  const onPress = () => {
    if (!data) return
    if (data.isBlocked) {
      unblockUser()
    } else {
      blockUser()
    }
  }

  return (
    <TouchableRedText style={style} iconId={data?.isBlocked ? 'rotateCounterClockwise' : 'userX'} onPress={onPress}>
      {i18n(data?.isBlocked ? 'profile.unblockUser' : 'profile.blockUser')}
    </TouchableRedText>
  )
}
