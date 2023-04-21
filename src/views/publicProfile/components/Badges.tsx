import { TouchableOpacity, View } from 'react-native'

import { Icon, Text } from '../../../components'
import { useShowHelp } from '../../../hooks/useShowHelp'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { badges } from '../../settings/profile/profileOverview/components/badges'
import { Badge } from './Badge'

export const Badges = ({ user }: { user: User }) => {
  const openPeachBadgesPopup = useShowHelp('myBadges')
  const { medals: unlockedBadges } = user

  return (
    <TouchableOpacity style={tw`flex-row flex-wrap items-center justify-center`} onPress={openPeachBadgesPopup}>
      {badges.map(([iconId, badgeName]) => (
        <View key={`profileOverviewIcon-${iconId}`} style={tw`flex-row items-center mr-2`}>
          <View
            style={[
              unlockedBadges.includes(badgeName) ? tw`bg-primary-main` : tw`bg-primary-mild-1`,
              tw`rounded-full mx-[2px]`,
            ]}
          >
            <Icon id={iconId} color={tw`text-primary-background-light`.color} style={tw`w-2 h-2 m-[2px]`} />
          </View>
          <Text
            style={[
              tw`uppercase notification`,
              unlockedBadges.includes(badgeName) ? tw`text-primary-main` : tw`text-primary-mild-1`,
            ]}
          >
            {i18n(`peachBadges.${badgeName}`)}
          </Text>
        </View>
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
          <Badge key={`profileOverviewIcon-${iconId}`} {...{ unlockedBadges, iconId, badgeName, isDispute }} />
        ))}
      </View>
      <Badge {...{ unlockedBadges, iconId: badges[2][0], badgeName: badges[2][1], isDispute }} />
    </TouchableOpacity>
  )
}
