import { View } from 'react-native'
import { NEW_USER_THRESHOLD } from '../constants'
import tw from '../styles/tailwind'
import { Rating } from '../views/settings/profile/profileOverview/components/Rating'
import { PeachID } from './PeachID'
import { Badges } from './matches/components/Badges'

type Props = { user: Pick<User, 'openedTrades' | 'id' | 'rating' | 'medals'>; isOnMatchCard?: boolean }

export const ProfileInfo = ({ user: { openedTrades, id, rating, medals }, isOnMatchCard = false }: Props) => {
  const isNewUser = openedTrades < NEW_USER_THRESHOLD
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
