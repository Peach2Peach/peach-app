import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import PeachBorder from '../../assets/logo/peachBorder.svg'
import PeachOrange from '../../assets/logo/peachOrange.svg'
import { Icon, Text } from '../../components'
import { NotificationBubble } from '../../components/bubble/NotificationBubble'
import { useNavigation, useRoute } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { HomeTabName, homeTabNames, homeTabs } from './homeTabNames'
import { useNotificationStore } from './notificationsStore'

const Tab = createBottomTabNavigator()

export function Home () {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      sceneContainerStyle={tw`flex-1`}
      tabBar={() => <Footer />}
      id="homeNavigator"
    >
      {homeTabNames.map((name) => (
        <Tab.Screen {...{ name }} key={`homeTab-${name}`} component={homeTabs[name]} />
      ))}
    </Tab.Navigator>
  )
}

function Footer () {
  const { bottom } = useSafeAreaInsets()
  return (
    <View
      style={[
        tw`flex-row items-center self-stretch justify-between pt-2 bg-primary-background`,
        tw.md`pt-4`,
        { paddingBottom: bottom },
      ]}
    >
      {homeTabNames.map((id) => (
        <FooterItem key={`footer-${id}`} id={id} />
      ))}
    </View>
  )
}

function FooterItem ({ id }: { id: HomeTabName }) {
  const currentPage = useRoute<'home'>().params?.screen
  const navigation = useNavigation()
  const onPress = () => {
    navigation.navigate('home', { screen: id })
  }

  const active = currentPage === id
  const color = active ? (id === 'settings' ? tw`text-primary-main` : tw`text-black-1`) : tw`text-black-2`
  const size = tw`w-6 h-6`
  const notifications = useNotificationStore((state) => state.notifications)
  return (
    <TouchableOpacity onPress={onPress} style={tw`items-center flex-1 gap-2px`}>
      <View style={size}>
        {id === 'settings' ? (
          active ? (
            <PeachOrange style={size} />
          ) : (
            <PeachBorder style={size} />
          )
        ) : (
          <Icon id={id} style={size} color={color.color} />
        )}
        {id === 'yourTrades' ? (
          <NotificationBubble notifications={notifications} style={tw`absolute -right-2 -top-2`} />
        ) : null}
      </View>
      <Text style={[color, tw`leading-relaxed text-center subtitle-1 text-9px`]}>{i18n(`footer.${id}`)}</Text>
    </TouchableOpacity>
  )
}
