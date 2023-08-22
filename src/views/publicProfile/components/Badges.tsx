import { TouchableOpacity, View } from 'react-native'

import { useShowHelp } from '../../../hooks/useShowHelp'
import tw from '../../../styles/tailwind'
import { badges } from '../../settings/profile/profileOverview/components/badges'
import { Badge } from './Badge'

export const ProfileBadges = ({ user }: { user: User }) => {
  const openPeachBadgesPopup = useShowHelp('myBadges')
  const { medals: unlockedBadges } = user

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

export const NewBadges = ({ user, isDispute = false }: { user: User; isDispute?: boolean }) => {
  const openPeachBadgesPopup = useShowHelp('myBadges')
  const { medals: unlockedBadges } = user

  return (
    <TouchableOpacity onPress={openPeachBadgesPopup}>
      <View style={tw`flex-row`}>
        {badges.slice(0, 2).map(([iconId, badgeName]) => (
          <Badge
            key={`profileOverviewIcon-${iconId}`}
            {...{ iconId, badgeName, isUnlocked: unlockedBadges.includes(badgeName), isDispute }}
          />
        ))}
      </View>
      <Badge
        {...{
          iconId: badges[2][0],
          badgeName: badges[2][1],
          isUnlocked: unlockedBadges.includes(badges[2][1]),
          isDispute,
        }}
      />
    </TouchableOpacity>
  )
}
