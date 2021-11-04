import React, { ReactElement, useContext, useReducer, useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import tw from './styles/tailwind'
import 'react-native-gesture-handler'
import {
  NavigationContainer,
  NavigationContainerRefWithCurrent,
  useNavigationContainerRef
} from '@react-navigation/native'
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
type ViewType = {
  name: keyof RootStackParamList,
  component: (props: any) => ReactElement
}
const views: ViewType[] = [
  { name: 'home', component: Home },
  { name: 'buy', component: Buy },
  { name: 'sell', component: Sell },
  { name: 'offers', component: Offers },
  { name: 'settings', component: Settings },
  { name: 'ComponentsTest', component: ComponentsTest },
  { name: 'AccountTest', component: AccountTest },
  { name: 'InputTest', component: InputTest },
  { name: 'PGPTest', component: PGPTest },
]
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
  const navigationRef = useNavigationContainerRef() as NavigationContainerRefWithCurrent<RootStackParamList>

  return <SafeAreaView style={tw`bg-white-1`}>
    <LanguageContext.Provider value={{ locale: i18n.getLocale() }}>
      <BitcoinContext.Provider value={bitcoinContext}>
        <View style={tw`h-full flex-col`}>
          <Header bitcoinContext={bitcoinContext} style={tw`z-10`} />
          <View style={tw`h-full flex-shrink`}>
            <NavigationContainer ref={navigationRef} onStateChange={(state) => {
              if (!state) return
              setCurrentPage(state.routes[state.routes.length - 1].name)
            }}>
              <Stack.Navigator screenOptions={{
                headerShown: false,
                cardStyle: [tw`bg-white-1 p-4`, tw.md`p-6`]
              }}>
                {views.map(view => <Stack.Screen name={view.name} component={view.component} key={view.name} />)}
              </Stack.Navigator>
            </NavigationContainer>
          </View>
          <Footer style={tw`z-10 absolute bottom-0`} active={currentPage} navigation={navigationRef} />
          {/* <LanguageSelect locale={locale} setLocale={setLocale}/> */}
        </View>
      </BitcoinContext.Provider>
    </LanguageContext.Provider>
  </SafeAreaView>
}
export default App
