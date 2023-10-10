import { View } from 'react-native'
import { IconType } from '../../../assets/icons'
import { Icon, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type Props = {
  iconId: IconType
  badgeName: string
  isUnlocked?: boolean
}

export const Badge = ({ iconId, badgeName, isUnlocked }: Props) => (
  <View style={tw`flex-row items-center mr-2`}>
    <View style={[isUnlocked ? tw`bg-primary-main` : tw`bg-primary-mild-1`, tw`rounded-full mx-[2px]`]}>
      <Icon id={iconId} color={tw`text-primary-background-light`.color} style={tw`w-2 h-2 m-[2px]`} />
    </View>
    <Text style={[tw`uppercase notification`, isUnlocked ? tw`text-primary-main` : tw`text-primary-mild-1`]}>
      {i18n(`peachBadges.${badgeName}`)}
    </Text>
  </View>
)
