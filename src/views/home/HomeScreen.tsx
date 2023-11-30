import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon, Text } from '../../components'
import { NotificationBubble } from '../../components/bubble/NotificationBubble'
import { useNavigation, useRoute } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { HomeTabName, homeTabNames, homeTabs } from './homeTabNames'
import { useNotificationStore } from './notificationsStore'

const Tab = createBottomTabNavigator()

export function HomeScreen () {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="home"
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
        tw`md:pt-4`,
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
  const currentPage = useRoute<'homeScreen'>().params?.screen ?? 'home'
  const navigation = useNavigation()
  const onPress = () => {
    navigation.navigate('homeScreen', { screen: id })
  }

  const active = currentPage === id
  const colorTheme = tw.color(active ? 'black-1' : 'black-2')
  const size = tw`w-6 h-6`
  const notifications = useNotificationStore((state) => state.notifications)
  return (
    <TouchableOpacity onPress={onPress} style={tw`items-center flex-1 gap-2px`}>
      <View style={size}>
        {id === 'home' ? (
          <Icon id={active ? 'home' : 'homeUnselected'} style={size} color={colorTheme} />
        ) : (
          <Icon id={id} style={size} color={colorTheme} />
        )}
        {id === 'yourTrades' ? (
          <NotificationBubble notifications={notifications} style={tw`absolute -right-2 -top-2`} />
        ) : null}
      </View>
      <Text
        style={[
          { color: colorTheme },
          id === 'home' && active && tw`text-primary-main`,
          tw`leading-relaxed text-center subtitle-1 text-9px`,
        ]}
      >
        {i18n(`footer.${id}`)}
      </Text>
    </TouchableOpacity>
  )
}
