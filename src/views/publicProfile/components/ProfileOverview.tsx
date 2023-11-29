import { View } from 'react-native'

import { Badges } from '../../../components/matches/components/Badges'
import tw from '../../../styles/tailwind'
import { Rating, UserId } from '../../settings/profile/profileOverview/components'

type Props = {
  user: Pick<User, 'rating' | 'trades' | 'medals' | 'id'>
  clickableID?: boolean
}

export const ProfileOverview = ({ user: { rating, medals, id, trades }, clickableID = false }: Props) => (
  <View style={tw`self-stretch gap-1`}>
    <View style={tw`flex-row items-center self-stretch justify-between`}>
      <UserId id={id} showInfo={clickableID} />
      <Rating rating={rating} isNewUser={trades <= 3} />
    </View>
    <Badges unlockedBadges={medals} id={id} />
  </View>
)
