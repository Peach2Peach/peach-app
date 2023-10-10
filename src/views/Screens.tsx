import { createStackNavigator } from '@react-navigation/stack'
import { useWindowDimensions } from 'react-native'
import tw from '../styles/tailwind'
import { account } from '../utils/account'
import { screenTransition } from '../utils/layout/screenTransition'
import { isIOS } from '../utils/system'
import { getViews } from './getViews'

const Stack = createStackNavigator<RootStackParamList>()
export const Screens = () => {
  const views = getViews(!!account?.publicKey)
  const { width } = useWindowDimensions()
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: isIOS(),
        headerShown: false,
      }}
    >
      {views.map(({ name, component, background, animationEnabled, headerShown }) => (
        <Stack.Screen
          {...{ name, component }}
          key={name}
          options={{
            headerShown: headerShown ?? false,
            gestureResponseDistance: width / 2,
            animationEnabled,
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
