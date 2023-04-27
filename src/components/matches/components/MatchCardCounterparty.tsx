import { View } from 'react-native'
import tw from '../../../styles/tailwind'

import { NewBadges } from '../../../views/publicProfile/components/Badges'
import { UserId, Rating } from '../../../views/settings/profile/profileOverview/components'

type Props = { user: User; isDispute?: boolean }

export const MatchCardCounterparty = ({ user, isDispute = false }: Props) => (
  <View>
    <View style={tw`flex-row justify-between`}>
      <UserId id={user.id} isDispute={isDispute} showInfo />
      <Rating rating={user.rating} isNewUser={user.trades <= 3} />
    </View>

    <NewBadges user={user} isDispute={isDispute} />
  </View>
)
