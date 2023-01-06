import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from '../../../../../components'
import { useShowHelp } from '../../../../../hooks/useShowHelp'
import { useUserQuery } from '../../../../../hooks/useUserQuery'
import tw from '../../../../../styles/tailwind'
import { account } from '../../../../../utils/account'
import { badges } from './badges'

export const MyBadges = () => {
  const { user, isLoading } = useUserQuery(account.publicKey)
  if (!user || isLoading) return null
  const { medals: unlockedBadges } = user
  const openPeachBadgesPopup = useShowHelp('myBadges')

  return (
    <TouchableOpacity style={tw`flex-row items-center`} onPress={openPeachBadgesPopup}>
      {badges.map(([iconId, badgeName]) => (
        <View
          key={`profileOverviewIcon-${iconId}`}
          style={[
            unlockedBadges.includes(badgeName) ? tw`bg-primary-main` : tw`bg-primary-mild-1`,
            tw`ml-2 p-[3px] rounded-full`,
          ]}
        >
          <Icon id={iconId} color={tw`text-primary-background-light`.color} style={tw`w-3 h-3`} />
        </View>
      ))}
    </TouchableOpacity>
  )
}
