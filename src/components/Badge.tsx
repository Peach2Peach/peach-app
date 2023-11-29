import { View } from 'react-native'
import { IconType } from '../assets/icons'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { useUserStatus } from '../views/publicProfile/useUserStatus'
import { Icon } from './Icon'
import { FixedHeightText } from './text'

type Props = {
  iconId: IconType
  badgeName: string
  isUnlocked?: boolean
}

export const Badge = ({ iconId, badgeName, isUnlocked }: Props) => {
  const colorStyle = isUnlocked ? tw`text-primary-main` : tw`text-primary-mild-1`
  return (
    <View
      style={[
        tw`flex-row items-center py-1 border rounded-full px-6px bg-primary-background-light gap-2px`,
        isUnlocked ? tw`border-primary-main` : tw`border-primary-mild-1`,
      ]}
    >
      <FixedHeightText style={[tw`subtitle-2 text-10px`, colorStyle]} height={6}>
        {i18n(`peachBadges.${badgeName}`)}
      </FixedHeightText>
      <Icon id={iconId} color={colorStyle.color} size={12} />
    </View>
  )
}

export function RepeatTraderBadge ({ id }: { id: User['id'] }) {
  const { data } = useUserStatus(id)

  if (!data?.trades) return null

  return (
    <View
      style={[
        tw`flex-row items-center py-1 border rounded-full px-6px bg-primary-background-light gap-2px`,
        data.badExperience ? tw`border-error-main` : tw`border-primary-main`,
      ]}
    >
      <FixedHeightText
        style={[tw`subtitle-2 text-10px`, data.badExperience ? tw`text-error-main` : tw`text-primary-main`]}
        height={6}
      >
        {i18n('peachBadges.repeatTrader')}
      </FixedHeightText>

      <View style={tw`items-center justify-center`}>
        <Icon
          id={data.badExperience ? 'thumbsDown' : 'refreshCcw'}
          color={(data.badExperience ? tw`text-error-main` : tw`text-primary-main`).color}
          size={12}
        />
        {!data.badExperience && (
          <View style={tw`absolute items-center justify-center w-3 h-3`}>
            <FixedHeightText
              style={[
                tw`w-1 text-center subtitle-2 text-8px`,
                data.badExperience ? tw`text-error-main` : tw`text-primary-main`,
              ]}
              height={4}
            >
              {data.trades}
            </FixedHeightText>
          </View>
        )}
      </View>
    </View>
  )
}
