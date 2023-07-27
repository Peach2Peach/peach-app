import { View } from 'react-native'

import tw from '../../../styles/tailwind'
import { Rating, UserId } from '../../settings/profile/profileOverview/components'
import { ProfileBadges } from './Badges'

type Props = ComponentProps & {
  user: User
  clickableID?: boolean
}

export const ProfileOverview = ({ user, clickableID = false, style }: Props) => (
  <View style={[tw`items-start px-1`, style]}>
    <View style={tw`flex-row items-center justify-between w-full`}>
      <UserId id={user.id} showInfo={clickableID} />
      <Rating rating={user.rating} isNewUser={user.trades <= 3} />
    </View>
    <ProfileBadges user={user} />
  </View>
)
