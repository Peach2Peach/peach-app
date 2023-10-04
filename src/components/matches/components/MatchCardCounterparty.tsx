import { TouchableOpacity, View } from 'react-native'
import tw from '../../../styles/tailwind'

import { useShowHelp } from '../../../hooks'
import { Badge } from '../../../views/publicProfile/components/Badge'
import { Rating, UserId } from '../../../views/settings/profile/profileOverview/components'
import { badges } from '../../../views/settings/profile/profileOverview/components/badges'

type Props = { user: Pick<User, 'trades' | 'id' | 'rating' | 'medals'> }

export const MatchCardCounterparty = ({ user: { trades, id, rating, medals } }: Props) => {
  const isNewUser = trades < 3
  return (
    <View>
      <View style={tw`flex-row justify-between`}>
        <UserId id={id} showInfo />
        <Rating rating={rating} isNewUser={isNewUser} />
      </View>

      {!isNewUser && <NewBadges unlockedBadges={medals} />}
    </View>
  )
}

function NewBadges ({ unlockedBadges }: { unlockedBadges: User['medals'] }) {
  const openPeachBadgesPopup = useShowHelp('myBadges')

  return (
    <TouchableOpacity onPress={openPeachBadgesPopup}>
      <View style={tw`flex-row`}>
        {badges.slice(0, 2).map(([iconId, badgeName]) => (
          <Badge
            key={`profileOverviewIcon-${iconId}`}
            isUnlocked={unlockedBadges.includes(badgeName)}
            {...{ iconId, badgeName }}
          />
        ))}
      </View>
      <Badge iconId={badges[2][0]} badgeName={badges[2][1]} isUnlocked={unlockedBadges.includes(badges[2][1])} />
    </TouchableOpacity>
  )
}
