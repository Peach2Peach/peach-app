import { View } from 'react-native'
import tw from '../styles/tailwind'
import { Rating } from '../views/settings/profile/profileOverview/components/Rating'
import { PeachID } from './PeachID'
import { Badges } from './matches/components/Badges'

type Props = { user: Pick<User, 'trades' | 'id' | 'rating' | 'medals'>; isOnMatchCard?: boolean }

const NEW_USER_TRADES = 3
export const ProfileInfo = ({ user: { trades, id, rating, medals }, isOnMatchCard = false }: Props) => {
  const isNewUser = trades < NEW_USER_TRADES
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
