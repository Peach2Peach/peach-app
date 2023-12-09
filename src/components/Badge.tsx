import { View } from 'react-native'
import { badgeIconMap } from '../constants'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { useUserStatus } from '../views/publicProfile/useUserStatus'
import { Icon } from './Icon'
import { FixedHeightText } from './text'

type Props = {
  badgeName: Medal
  isUnlocked?: boolean
}

export const Badge = ({ badgeName, isUnlocked }: Props) => {
  const colorStyle = isUnlocked ? 'text-primary-main' : 'text-primary-mild-1'
  const iconId = badgeIconMap[badgeName]
  return (
    <View
      style={[
        tw`flex-row items-center py-1 border rounded-full px-6px bg-primary-background-light gap-2px`,
        isUnlocked ? tw`border-primary-main` : tw`border-primary-mild-1`,
      ]}
    >
      <FixedHeightText style={[tw`subtitle-2 text-10px`, tw.style(colorStyle)]} height={6}>
        {i18n(`peachBadges.${badgeName}`)}
      </FixedHeightText>
      <Icon id={iconId} color={tw.color(colorStyle)} size={12} />
    </View>
  )
}

export function RepeatTraderBadge ({ id }: { id: User['id'] }) {
  const { data } = useUserStatus(id)

  if (!data?.trades) return null

  const hadBadExperience = data?.badExperience
  const colorTheme = tw.color(hadBadExperience ? 'error-main' : 'primary-main')

  return (
    <View
      style={[
        tw`flex-row items-center py-1 border rounded-full px-6px bg-primary-background-light gap-2px`,
        { borderColor: colorTheme },
      ]}
    >
      <FixedHeightText style={[tw`subtitle-2 text-10px`, { color: colorTheme }]} height={6}>
        {i18n('peachBadges.repeatTrader')}
      </FixedHeightText>

      <View style={tw`items-center justify-center`}>
        <Icon id={hadBadExperience ? 'thumbsDown' : 'refreshCcw'} color={colorTheme} size={12} />
        {!hadBadExperience && (
          <View style={tw`absolute items-center justify-center w-3 h-3`}>
            <FixedHeightText style={[tw`w-1 text-center subtitle-2 text-8px`, { color: colorTheme }]} height={4}>
              {data.trades}
            </FixedHeightText>
          </View>
        )}
      </View>
    </View>
  )
}
