import React, { useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from '../../../../../components'
import { OverlayContext } from '../../../../../contexts/overlay'
import { useNavigation } from '../../../../../hooks'
import tw from '../../../../../styles/tailwind'
import i18n from '../../../../../utils/i18n'
import { MyBadgesPopup } from './MyBadgesPopup'

const icons = ['star', 'zap', 'award'] as const
export const Badges = () => {
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
      {icons.map((id) => (
        <View key={`profileOverviewIcon-${id}`} style={tw`ml-4 p-[3px] rounded-full bg-primary-main`}>
          <Icon id={id} color={tw`text-primary-background-light`.color} style={tw`w-3 h-3`} />
        </View>
      ))}
    </TouchableOpacity>
  )
}
