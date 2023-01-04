import React, { useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from '../../../../../components'
import { OverlayContext } from '../../../../../contexts/overlay'
import { useNavigation } from '../../../../../hooks'
import { useUserQuery } from '../../../../../hooks/useUserQuery'
import tw from '../../../../../styles/tailwind'
import { account } from '../../../../../utils/account'
import i18n from '../../../../../utils/i18n'
import { MyBadgesPopup } from './MyBadgesPopup'

const badges = [
  ['star', 'fastTrader'],
  ['zap', 'superTrader'],
  ['award', 'ambassador'],
] as const

export const MyBadges = () => {
  const { user, isLoading } = useUserQuery(account.publicKey)
  if (!user || isLoading) return null
  const { medals: unlockedBadges } = user
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const openPeachBadgesPopup = () =>
    updateOverlay({
      content: <MyBadgesPopup />,
      visible: true,
      level: 'INFO',
      title: i18n('peachBadges'),
      action2: {
        icon: 'alertCircle',
        label: i18n('help'),
        callback: () => {
          updateOverlay({ visible: false })
          navigation.navigate('contact')
        },
      },
    })

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
