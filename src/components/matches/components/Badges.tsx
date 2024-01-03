import { TouchableOpacity } from 'react-native'
import { HelpPopup } from '../../../hooks/HelpPopup'
import tw from '../../../styles/tailwind'
import { badges } from '../../../views/settings/profile/profileOverview/badges'
import { Badge, RepeatTraderBadge } from '../../Badge'
import { useSetPopup } from '../../popup/Popup'

export function Badges ({ unlockedBadges, id }: { unlockedBadges: User['medals']; id: User['id'] }) {
  const setPopup = useSetPopup()
  const openPeachBadgesPopup = () => setPopup(<HelpPopup id="myBadges" />)

  return (
    <TouchableOpacity style={tw`flex-row flex-wrap gap-1 max-w-46`} onPress={openPeachBadgesPopup}>
      {badges.map(([iconId, badgeName]) => (
        <Badge
          key={`profileOverviewIcon-${iconId}`}
          isUnlocked={unlockedBadges.includes(badgeName)}
          badgeName={badgeName}
        />
      ))}
      <RepeatTraderBadge id={id} />
    </TouchableOpacity>
  )
}
