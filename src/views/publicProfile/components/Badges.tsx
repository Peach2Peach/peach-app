import { TouchableOpacity, View } from 'react-native'

import { useShowHelp } from '../../../hooks/useShowHelp'
import tw from '../../../styles/tailwind'
import { badges } from '../../settings/profile/profileOverview/components/badges'
import { Badge } from './Badge'

type Props = {
  unlockedBadges: User['medals']
  isDispute?: boolean
}

export const NewBadges = ({ unlockedBadges, isDispute = false }: Props) => {
  const openPeachBadgesPopup = useShowHelp('myBadges')

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
