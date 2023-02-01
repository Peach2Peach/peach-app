import React from 'react'
import { View } from 'react-native'
import { Rating } from './components/Rating'
import { useUser } from '../../../../hooks/query/useUserQuery'
import tw from '../../../../styles/tailwind'
import { account } from '../../../../utils/account'
import { MyBadges } from './components/MyBadges'
import { ProfileImage } from './components/ProfileImage'
import { UserId } from './components/UserId'

export const MyProfileOverview = ({ style }: ComponentProps) => {
  const { user, isLoading } = useUser(account.publicKey)
  if (isLoading || !user) return null

  return (
    <View style={[tw`flex-row justify-between`, style]}>
      <View style={tw`flex-row items-center`}>
        <ProfileImage />
        <View style={tw`ml-2`}>
          <UserId id={user.id} />
          <Rating rating={user.rating} />
        </View>
      </View>
      <MyBadges />
    </View>
  )
}
