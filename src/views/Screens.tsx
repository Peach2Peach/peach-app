import { createStackNavigator } from '@react-navigation/stack'
import tw from '../styles/tailwind'
import { account } from '../utils/account'
import { screenTransition } from '../utils/layout/screenTransition'
import { isIOS } from '../utils/system'
import { views } from './views'

const Stack = createStackNavigator<RootStackParamList>()
export const Screens = () => (
  <Stack.Navigator
    screenOptions={{
      gestureEnabled: isIOS(),
      headerShown: false,
    }}
    initialRouteName={account.publicKey ? 'welcome' : 'buy'}
  >
    {views.map(({ name, component, background, animationEnabled, headerShown }) => (
      <Stack.Screen
        {...{ name, component }}
        key={name}
        options={{
          headerShown: headerShown ?? false,
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
