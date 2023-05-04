import { View } from 'react-native'

import { useCurrentUser, useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { AccountInfo } from '../settings/profile/accountInfo/AccountInfo'
import { ProfileOverview } from './components'

export default () => {
  const { user, isLoading } = useCurrentUser()
  useHeaderSetup({ title: i18n('profile.user.title') })
  if (isLoading || !user) return <></>

  return (
    <View style={tw`h-full px-8`}>
      <ProfileOverview style={tw`mt-[48.5px] items-start`} user={user} />
      <AccountInfo style={tw`ml-1 mt-13`} user={user} />
    </View>
  )
}
