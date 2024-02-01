import { View } from 'react-native'
import { NEW_USER_TRADE_THRESHOLD } from '../constants'
import tw from '../styles/tailwind'
import { Rating } from '../views/settings/profile/profileOverview/Rating'
import { PeachID } from './PeachID'
import { Badges } from './matches/components/Badges'

type Props = {
  user: Pick<User, 'openedTrades' | 'canceledTrades' |'disputes' | 'id' | 'rating' | 'medals'>
  isOnMatchCard?: boolean
}

export const ProfileInfo = ({
  user: { openedTrades, canceledTrades, disputes, id, rating, medals },
  isOnMatchCard = false,
}: Props) => {
  const isNewUser = openedTrades < NEW_USER_TRADE_THRESHOLD && canceledTrades === 0 && disputes.lost === 0
  return (
    <View style={tw`gap-1`}>
      <View style={tw`flex-row items-center justify-between`}>
        <PeachID id={id} copyable={!isOnMatchCard} />
        <Rating rating={rating} isNewUser={isNewUser} />
      </View>

      {!isNewUser && <Badges unlockedBadges={medals} id={id} />}
    </View>
  )
}
