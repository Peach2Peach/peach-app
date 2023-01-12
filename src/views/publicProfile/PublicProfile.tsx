import React from 'react'
import { View } from 'react-native'

import { useCurrentUser, useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { AccountInfo } from '../settings/profile/accountInfo/AccountInfo'
import { ProfileOverview } from './components/ProfileOverview'

const headerConfig = { title: i18n('profile.user.title') }

export default () => {
  const { user, isLoading } = useCurrentUser()
  useHeaderSetup(headerConfig)
  if (isLoading || !user) return <></>

  return (
    <View style={tw`h-full px-8`}>
      <ProfileOverview style={tw`mt-[48.5px]`} user={user} />
      <AccountInfo style={tw`ml-1`} user={user} />
    </View>
  )
}
