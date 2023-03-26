import { View } from 'react-native'

import tw from '../../../styles/tailwind'
import { Rating, UserId } from '../../settings/profile/profileOverview/components'
import { Badges } from './Badges'

type Props = ComponentProps & {
  user: User
  clickableID?: boolean
}

export const ProfileOverview = ({ user, clickableID = false, style }: Props) => (
  <View style={[tw`px-1`, style]}>
    <View style={tw`flex-row flex-wrap mb-[6px] justify-center items-center`}>
      <UserId id={user.id} showInfo={clickableID} style={tw`mr-3`} />
      <Rating rating={user.rating} isNewUser={user.trades <= 3} />
    </View>
    <Badges user={user} />
  </View>
)
