import React from 'react'
import { View } from 'react-native'

import tw from '../../../styles/tailwind'
import { ProfileImage } from '../../settings/profile/profileOverview/components/ProfileImage'
import { Rating } from '../../settings/profile/profileOverview/components/Rating'
import { UserId } from '../../settings/profile/profileOverview/components/UserId'
import { Badges } from './Badges'

type Props = ComponentProps & {
  user: User
  clickableID?: boolean
}

export const ProfileOverview = ({ style, user, clickableID = false }: Props) => (
  <View style={[tw`flex-row justify-between`, style]}>
    <View style={tw`flex-row items-center`}>
      <ProfileImage />
      <View style={tw`ml-2`}>
        <UserId id={user.id} showInfo={clickableID} />
        <Rating rating={user.rating} />
      </View>
    </View>
    <Badges user={user} />
  </View>
)
