import React, { useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from '../../../../../components'
import { OverlayContext } from '../../../../../contexts/overlay'
import { useNavigation } from '../../../../../hooks'
import tw from '../../../../../styles/tailwind'
import i18n from '../../../../../utils/i18n'
import { MyBadgesPopup } from './MyBadgesPopup'

const icons = ['star', 'zap', 'award'] as const
export const MyBadges = () => {
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

  const enabled = true // TODO: get from user data

  return (
    <TouchableOpacity style={tw`flex-row items-center`} onPress={openPeachBadgesPopup}>
      {icons.map((id) => (
        <View
          key={`profileOverviewIcon-${id}`}
          style={[enabled ? tw`bg-primary-main` : tw`bg-primary-mild-1`, tw`ml-4 p-[3px] rounded-full`]}
        >
          <Icon id={id} color={tw`text-primary-background-light`.color} style={tw`w-3 h-3`} />
        </View>
      ))}
    </TouchableOpacity>
  )
}
