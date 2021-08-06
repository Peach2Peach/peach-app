import React from 'react'
import { SafeAreaView } from 'react-native'
import tw from './styles/tailwind'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './views/home/Home'
import AccountTest from './views/accountTest/AccountTest'
import { enableScreens } from 'react-native-screens'

enableScreens()

type RootStackParamList = {
  Home: undefined,
  AccountTest: undefined
}
const Stack = createStackNavigator<RootStackParamList>()

const App: React.FC = () => <SafeAreaView style={[tw`p-4 h-full bg-red-50`, tw.md`p-6`]}>
  <NavigationContainer>
    <Stack.Navigator screenOptions={{
      headerShown: false,
      cardStyle: tw`bg-red-50`
    }}>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="AccountTest" component={AccountTest}/>
    </Stack.Navigator>
  </NavigationContainer>
</SafeAreaView>

export default App
