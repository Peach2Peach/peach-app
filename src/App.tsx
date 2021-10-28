import React, { useContext, useReducer, useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import tw from './styles/tailwind'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './views/home/Home'
import ComponentsTest from './views/componentsTest/ComponentsTest'
import AccountTest from './views/accountTest/AccountTest'
import InputTest from './views/inputTest/InputTest'
import { enableScreens } from 'react-native-screens'
import LanguageContext, { LanguageSelect } from './components/inputs/LanguageSelect'
import BitcoinContext, { getBitcoinContext, updateBitcoinContext } from './components/bitcoin'
import i18n from './utils/i18n'
import PGPTest from './views/pgpTest/PGPTest'
import { Header, Text } from './components'

enableScreens()

type RootStackParamList = {
  Home: undefined,
  AccountTest: undefined,
  InputTest: undefined,
  PGPTest: undefined,
  ComponentsTest: undefined
}
const Stack = createStackNavigator<RootStackParamList>()


const App: React.FC = () => {
  useContext(LanguageContext)
  const [{ locale }, setLocale] = useReducer(i18n.setLocale, { locale: 'en' })
  const bitcoinContext = getBitcoinContext()
  const [, setBitcoinContext] = useState(getBitcoinContext())

  React.useEffect(() => {
    (async () => {
      const interval = setInterval(async () => {
        setBitcoinContext(await updateBitcoinContext(bitcoinContext.currency))
      }, 60 * 1000)

      setBitcoinContext(await updateBitcoinContext(bitcoinContext.currency))

      return () => clearInterval(interval)
    })()
  }, [bitcoinContext.currency])


  return <SafeAreaView style={tw`h-full bg-white-1`}>
    <LanguageContext.Provider value={{ locale: i18n.getLocale() }}>
      <BitcoinContext.Provider value={bitcoinContext}>
        <Header bitcoinContext={bitcoinContext} style={tw`z-10`} />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            headerShown: false,
            cardStyle: [tw`bg-white-1 p-4`, tw.md`p-6`]
          }}>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="ComponentsTest" component={ComponentsTest}/>
            <Stack.Screen name="AccountTest" component={AccountTest}/>
            <Stack.Screen name="InputTest" component={InputTest}/>
            <Stack.Screen name="PGPTest" component={PGPTest}/>
          </Stack.Navigator>
        </NavigationContainer>
        <LanguageSelect locale={locale} setLocale={setLocale}/>
      </BitcoinContext.Provider>
    </LanguageContext.Provider>
  </SafeAreaView>
}
export default App
