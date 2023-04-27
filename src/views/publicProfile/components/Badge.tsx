import { View } from 'react-native'
import { IconType } from '../../../assets/icons'
import { Icon, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getBadgeColor } from './getBadgeColor'
import { getBadgeTextColor } from './getBadgeTextColor'

type Props = {
  iconId: IconType
  badgeName: string
  isUnlocked?: boolean
  isDispute?: boolean
}

export const Badge = ({ iconId, badgeName, isUnlocked, isDispute }: Props) => (
  <View style={tw`flex-row items-center mr-2`}>
    <View style={[getBadgeColor(isUnlocked, isDispute), tw`rounded-full mx-[2px]`]}>
      <Icon id={iconId} color={tw`text-primary-background-light`.color} style={tw`w-2 h-2 m-[2px]`} />
    </View>
    <Text style={[tw`uppercase notification`, getBadgeTextColor(isUnlocked, isDispute)]}>
      {i18n(`peachBadges.${badgeName}`)}
    </Text>
  </View>
)
