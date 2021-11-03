import React, { useContext, useReducer, useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import tw from './styles/tailwind'
import 'react-native-gesture-handler'
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'
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
import { Footer, Header } from './components'
import Buy from './views/buy/Buy'
import Sell from './views/sell/Sell'
import Offers from './views/offers/Offers'
import Settings from './views/settings/Settings'

enableScreens()

const Stack = createStackNavigator<RootStackParamList>()


const App: React.FC = () => {
  useContext(LanguageContext)
  const [{ locale }, setLocale] = useReducer(i18n.setLocale, { locale: 'en' })
  const bitcoinContext = getBitcoinContext()
  const [, setBitcoinContext] = useState(getBitcoinContext())
  const [currentPage, setCurrentPage] = useState('home')

  React.useEffect(() => {
    (async () => {
      const interval = setInterval(async () => {
        setBitcoinContext(await updateBitcoinContext(bitcoinContext.currency))
      }, 60 * 1000)

      setBitcoinContext(await updateBitcoinContext(bitcoinContext.currency))

      return () => clearInterval(interval)
    })()
  }, [bitcoinContext.currency])
  const navigationRef = useNavigationContainerRef() // You can also use a regular ref with `React.useRef()`


  return <SafeAreaView style={tw`h-full bg-white-1 flex`}>
    <LanguageContext.Provider value={{ locale: i18n.getLocale() }}>
      <BitcoinContext.Provider value={bitcoinContext}>
        <Header bitcoinContext={bitcoinContext} style={tw`z-10`} />
        <NavigationContainer ref={navigationRef} onStateChange={(state) => {
          if (!state) return
          setCurrentPage(state.routes[state.routes.length - 1].name)
        }}>
          <Stack.Navigator screenOptions={{
            headerShown: false,
            cardStyle: [tw`bg-white-1 p-4`, tw.md`p-6`]
          }}>
            <Stack.Screen name="home" component={Home}/>
            <Stack.Screen name="buy" component={Buy}/>
            <Stack.Screen name="sell" component={Sell}/>
            <Stack.Screen name="offers" component={Offers}/>
            <Stack.Screen name="settings" component={Settings}/>
            <Stack.Screen name="ComponentsTest" component={ComponentsTest}/>
            <Stack.Screen name="AccountTest" component={AccountTest}/>
            <Stack.Screen name="InputTest" component={InputTest}/>
            <Stack.Screen name="PGPTest" component={PGPTest}/>
          </Stack.Navigator>
        </NavigationContainer>
        <Footer style={tw`z-10 -mt-14`} active={currentPage} navigation={navigationRef} />
        {/* <LanguageSelect locale={locale} setLocale={setLocale}/> */}
      </BitcoinContext.Provider>
    </LanguageContext.Provider>
  </SafeAreaView>
}
export default App
