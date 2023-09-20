import { View } from 'react-native'
import tw from '../../../styles/tailwind'

import { NewBadges } from '../../../views/publicProfile/components/Badges'
import { Rating, UserId } from '../../../views/settings/profile/profileOverview/components'

type Props = { user: Pick<User, 'trades' | 'id' | 'rating' | 'medals'>; isDispute?: boolean }

export const MatchCardCounterparty = ({ user: { trades, id, rating, medals }, isDispute = false }: Props) => {
  const isNewUser = trades < 3
  return (
    <View>
      <View style={tw`flex-row justify-between`}>
        <UserId id={id} isDispute={isDispute} showInfo />
        <Rating rating={rating} isNewUser={isNewUser} />
      </View>

      {!isNewUser && <NewBadges unlockedBadges={medals} isDispute={isDispute} />}
    </View>
  )
}
