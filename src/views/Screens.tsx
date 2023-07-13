import { Header } from '../components'
import tw from '../styles/tailwind'
import { getViews } from './getViews'
import { account } from '../utils/account'
import { screenTransition } from '../utils/layout/screenTransition'
import { isIOS } from '../utils/system'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator<RootStackParamList>()
export const Screens = () => {
  const views = getViews(!!account?.publicKey)
  return (
    <Stack.Navigator
      detachInactiveScreens={true}
      screenOptions={{
        gestureEnabled: isIOS(),
        headerShown: false,
      }}
    >
      {views.map(({ name, component, showHeader, background, animationEnabled }) => (
        <Stack.Screen
          {...{ name, component }}
          key={name}
          options={{
            headerShown: showHeader,
            animationEnabled,
            header: () => <Header />,
            cardStyle: !background.color && tw`bg-primary-background`,
            transitionSpec: {
              open: screenTransition,
              close: screenTransition,
            },
          }}
        />
      ))}
    </Stack.Navigator>
  )
}
