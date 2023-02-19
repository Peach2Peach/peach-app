import React from 'react'
import { View } from 'react-native'

import tw from '../../../styles/tailwind'
import { ProfileImage, Rating, UserId } from '../../settings/profile/profileOverview/components'
import { NewRating } from '../../settings/profile/profileOverview/components/Rating'
import { NewUserId } from '../../settings/profile/profileOverview/components/UserId'
import { Badges, NewBadges } from './Badges'

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

export const PublicProfileOverview = ({ user, clickableID = false, style }: Props) => (
  <View style={[tw`px-1`, style]}>
    <View style={tw`flex-row items-center justify-between mb-1`}>
      <NewUserId id={user.id} showInfo={clickableID} />
      <NewRating rating={user.rating} />
    </View>
    <NewBadges user={user} />
  </View>
)
