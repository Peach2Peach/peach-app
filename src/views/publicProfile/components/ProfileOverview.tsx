import { TouchableOpacity, View } from 'react-native'

import { useShowHelp } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { Rating, UserId } from '../../settings/profile/profileOverview/components'
import { badges } from '../../settings/profile/profileOverview/components/badges'
import { Badge } from './Badge'

type Props = {
  user: Pick<User, 'rating' | 'trades' | 'medals' | 'id'>
  clickableID?: boolean
}

export const ProfileOverview = ({ user: { rating, medals, id, trades }, clickableID = false }: Props) => (
  <View style={tw`self-stretch gap-2px`}>
    <View style={tw`flex-row items-center self-stretch justify-between`}>
      <UserId id={id} showInfo={clickableID} />
      <Rating rating={rating} isNewUser={trades <= 3} />
    </View>
    <ProfileBadges unlockedBadges={medals} />
  </View>
)

function ProfileBadges ({ unlockedBadges }: { unlockedBadges: User['medals'] }) {
  const openPeachBadgesPopup = useShowHelp('myBadges')

  return (
    <TouchableOpacity style={tw`flex-row items-center self-stretch justify-between`} onPress={openPeachBadgesPopup}>
      {badges.map(([iconId, badgeName]) => (
        <Badge
          key={`profileOverviewIcon-${iconId}`}
          {...{ iconId, badgeName, isUnlocked: unlockedBadges.includes(badgeName) }}
        />
      ))}
    </TouchableOpacity>
  )
}
