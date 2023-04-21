import { View } from 'react-native'
import { IconType } from '../../../assets/icons'
import { Icon, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getBadgeColor } from './getBadgeColor'
import { getBadgeTextColor } from './getBadgeTextColor'

type Props = {
  unlockedBadges: string[]
  iconId: IconType
  badgeName: string
  isDispute?: boolean
}

export const Badge = ({ unlockedBadges, iconId, badgeName, isDispute }: Props) => (
  <View style={tw`flex-row items-center mr-2`}>
    <View style={[getBadgeColor(unlockedBadges, badgeName, isDispute), tw`rounded-full mx-[2px]`]}>
      <Icon id={iconId} color={tw`text-primary-background-light`.color} style={tw`w-2 h-2 m-[2px]`} />
    </View>
    <Text style={[tw`uppercase notification`, getBadgeTextColor(unlockedBadges, badgeName, isDispute)]}>
      {i18n(`peachBadges.${badgeName}`)}
    </Text>
  </View>
)
