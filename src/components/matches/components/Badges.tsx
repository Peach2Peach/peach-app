import { TouchableOpacity } from 'react-native'
import { useShowHelp } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { badges } from '../../../views/settings/profile/profileOverview/components/badges'
import { Badge, RepeatTraderBadge } from '../../Badge'

export function Badges ({ unlockedBadges, id }: { unlockedBadges: User['medals']; id: User['id'] }) {
  const openPeachBadgesPopup = useShowHelp('myBadges')

  return (
    <TouchableOpacity style={tw`flex-row flex-wrap gap-1 max-w-50`} onPress={openPeachBadgesPopup}>
      {badges.map(([iconId, badgeName]) => (
        <Badge
          key={`profileOverviewIcon-${iconId}`}
          isUnlocked={unlockedBadges.includes(badgeName)}
          {...{ iconId, badgeName }}
        />
      ))}
      <RepeatTraderBadge id={id} />
    </TouchableOpacity>
  )
}
