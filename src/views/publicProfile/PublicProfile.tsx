import { View } from 'react-native'
import { Header, Screen } from '../../components'
import { useCurrentUser } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { AccountInfo } from '../settings/profile/accountInfo/AccountInfo'
import { ProfileOverview } from './components'

export const PublicProfile = () => {
  const { user, isLoading } = useCurrentUser()
  if (isLoading || !user) return <></>

  return (
    <Screen header={<Header title={i18n('profile.user.title')} />}>
      <View style={[tw`gap-12 pt-sm`, tw.md`pt-md`]}>
        <ProfileOverview user={user} />
        <AccountInfo user={user} />
      </View>
    </Screen>
  )
}
