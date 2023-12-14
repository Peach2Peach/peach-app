import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { Rating } from '../../../views/settings/profile/profileOverview/components/Rating'
import { UserId } from '../../../views/settings/profile/profileOverview/components/UserId'
import { Badges } from './Badges'

type Props = { user: Pick<User, 'trades' | 'id' | 'rating' | 'medals'> }

export const MatchCardCounterparty = ({ user: { trades, id, rating, medals } }: Props) => {
  const isNewUser = trades < 3
  return (
    <View>
      <View style={tw`flex-row justify-between`}>
        <UserId id={id} showInfo />
        <Rating rating={rating} isNewUser={isNewUser} />
      </View>

      {!isNewUser && <Badges unlockedBadges={medals} id={id} />}
    </View>
  )
}
