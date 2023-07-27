import { Screen } from '../../components'

import { useCurrentUser, useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { AccountInfo } from '../settings/profile/accountInfo/AccountInfo'
import { ProfileOverview } from './components'

export const PublicProfile = () => {
  const { user, isLoading } = useCurrentUser()
  useHeaderSetup(i18n('profile.user.title'))
  if (isLoading || !user) return <></>

  return (
    <Screen style={[tw`pt-sm gap-48px`, tw.md`pt-md`]}>
      <ProfileOverview user={user} />
      <AccountInfo user={user} />
    </Screen>
  )
}
