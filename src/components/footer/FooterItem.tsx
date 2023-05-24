import { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Text } from '..'
import { IconType } from '../../assets/icons'
import PeachBorder from '../../assets/logo/peachBorder.svg'
import PeachOrange from '../../assets/logo/peachOrange.svg'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { footerThemes } from './footerThemes'
import { NotificationBubble } from './NotificationBubble'

type Props = {
  id: IconType
  active: boolean
  onPress: () => void
  theme?: 'default' | 'inverted'
  notifications?: number
}

export const FooterItem = ({ id, active, onPress, notifications = 0, theme = 'default' }: Props): ReactElement => {
  const colors = footerThemes[theme]
  const color = active ? (id === 'settings' ? colors.textSelectedSettings : colors.textSelected) : colors.text
  return (
    <Pressable testID={`footer-${id}`} onPress={onPress} style={tw`flex-row justify-center w-1/5`}>
      <View>
        <View style={tw`flex items-center`}>
          {id === 'settings' && theme === 'default' ? (
            active ? (
              <PeachOrange style={tw`w-6 h-6`} />
            ) : (
              <PeachBorder style={tw`w-6 h-6`} />
            )
          ) : (
            <Icon id={id} style={tw`w-6 h-6`} color={color.color} />
          )}
          <Text style={[color, tw`leading-relaxed text-center subtitle-1 text-3xs`]}>{i18n(`footer.${id}`)}</Text>
        </View>
        {theme === 'default' && notifications ? (
          <View
            style={[
              tw`absolute w-20px h-20px -top-2 left-1/2 bg-primary-main`,
              tw`border-2 rounded-full border-primary-background`,
            ]}
          >
            <NotificationBubble {...{ notifications }} />
          </View>
        ) : null}
      </View>
    </Pressable>
  )
}
