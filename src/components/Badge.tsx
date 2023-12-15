import { View } from 'react-native'
import { badgeIconMap } from '../constants'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { useUserStatus } from '../views/publicProfile/useUserStatus'
import { Icon } from './Icon'
import { FixedHeightText } from './text/FixedHeightText'
import { PeachText } from './text/PeachText'

type Props = {
  badgeName: Medal
  isUnlocked?: boolean
}

export const horizontalBadgePadding = 6

export const Badge = ({ badgeName, isUnlocked }: Props) => {
  const colorStyle = isUnlocked ? 'text-primary-main' : 'text-primary-mild-1'
  const iconId = badgeIconMap[badgeName]
  return (
    <View
      style={[
        tw`flex-row items-center py-1 border rounded-full bg-primary-background-light gap-2px`,
        { paddingHorizontal: horizontalBadgePadding },
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
        tw`flex-row items-center border rounded-full bg-primary-background-light gap-2px`,
        { paddingHorizontal: horizontalBadgePadding },
        { borderColor: colorTheme },
      ]}
    >
      <PeachText style={[tw`subtitle-2 text-10px`, { color: colorTheme }]}>{i18n('peachBadges.repeatTrader')}</PeachText>

      <View
        style={[
          tw`items-center justify-center`,
          !hadBadExperience && [tw`border rounded-full p-3px`, { borderColor: colorTheme }],
        ]}
      >
        {hadBadExperience ? (
          <Icon id={'thumbsDown'} color={colorTheme} size={12} />
        ) : (
          <PeachText style={[tw`my-[-6px] subtitle-2 text-10px`, { color: colorTheme, lineHeight: 0 }]}>
            {data.trades}
          </PeachText>
        )}
      </View>
    </View>
  )
}
