import React, { ReactElement, useEffect, useReducer, useRef, useState } from 'react'
import { SafeAreaView, View, Animated } from 'react-native'
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
import LanguageContext from './components/inputs/LanguageSelect'
import BitcoinContext, { getBitcoinContext, updateBitcoinContext } from './components/bitcoin'
import i18n from './utils/i18n'
import PGPTest from './views/pgpTest/PGPTest'
import { Footer, Header, LanguageSelect } from './components'
import Buy from './views/buy/Buy'
import Sell from './views/sell/Sell'
import Offers from './views/offers/Offers'
import Settings from './views/settings/Settings'
import Welcome from './views/welcome/Welcome'
import NewUser from './views/newUser/NewUser'
import Tutorial from './views/tutorial/Tutorial'
import Message from './components/Message'
import { getMessage, MessageContext, setMessage } from './utils/messageUtils'
import GetWindowDimensions from './hooks/GetWindowDimensions'
import { initSession } from './utils/accountUtils'

enableScreens()

const Stack = createStackNavigator<RootStackParamList>()
type ViewType = {
  name: keyof RootStackParamList,
  component: (props: any) => ReactElement
}
const views: ViewType[] = [
  { name: 'welcome', component: Welcome },
  { name: 'newUser', component: NewUser },
  { name: 'tutorial', component: Tutorial },
  { name: 'home', component: Home },
  { name: 'buy', component: Buy },
  { name: 'sell', component: Sell },
  { name: 'offers', component: Offers },
  { name: 'settings', component: Settings },
  { name: 'componentsTest', component: ComponentsTest },
  { name: 'accountTest', component: AccountTest },
  { name: 'inputTest', component: InputTest },
  { name: 'pgpTest', component: PGPTest },
]
// eslint-disable-next-line max-lines-per-function
const App: React.FC = () => {
  const [{ locale }, setLocale] = useReducer(i18n.setLocale, { locale: 'en' })
  const [{ msg, level, time }, updateMessage] = useReducer(setMessage, getMessage())
  const { width } = GetWindowDimensions()
  const slideInAnim = useRef(new Animated.Value(-width)).current
  const navigationRef = useNavigationContainerRef() as NavigationContainerRefWithCurrent<RootStackParamList>

  const bitcoinContext = getBitcoinContext()
  const [, setBitcoinContext] = useState(getBitcoinContext())
  const [currentPage, setCurrentPage] = useState('home')

  const skipTutorial = false // TODO store value somewhere

  useEffect(() => {
    let slideOutTimeout: NodeJS.Timer

    if (msg) {
      Animated.timing(slideInAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start()

      slideOutTimeout = setTimeout(() => Animated.timing(slideInAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: false
      }).start(), 1000 * 10)
    }

    return () => clearTimeout(slideOutTimeout)
  }, [msg, time])

  useEffect(() => {
    (async () => {
      const interval = setInterval(async () => {
        // TODO add error handling in case data is not available
        setBitcoinContext(await updateBitcoinContext(bitcoinContext.currency))
      }, 60 * 1000)
      // TODO add error handling in case data is not available
      setBitcoinContext(await updateBitcoinContext(bitcoinContext.currency))

      return () => {
        clearInterval(interval)
      }
    })()

  }, [bitcoinContext.currency])

  useEffect(() => {
    (async () => {
      await initSession()
    })()
  }, [])


  return <SafeAreaView style={tw`bg-white-1`}>
    <LanguageContext.Provider value={{ locale: i18n.getLocale() }}>
      <BitcoinContext.Provider value={bitcoinContext}>
        <MessageContext.Provider value={[{ msg, level }, updateMessage]}>
          <View style={tw`h-full flex-col`}>
            {skipTutorial
              ? <Header bitcoinContext={bitcoinContext} style={tw`z-10`} />
              : <View style={tw`absolute top-10 right-4 z-20`}>
                <LanguageSelect locale={locale} setLocale={setLocale} />
              </View>
            }
            {msg
              ? <Animated.View style={[tw`absolute z-20 w-full`, { left: slideInAnim }]}>
                <Message msg={msg} level={level} style={{ minHeight: 60 }} />
              </Animated.View>
              : null
            }
            <View style={tw`h-full flex-shrink`}>
              <NavigationContainer ref={navigationRef} onStateChange={(state) => {
                if (state) setCurrentPage(state.routes[state.routes.length - 1].name)
              }}>
                <Stack.Navigator screenOptions={{
                  headerShown: false,
                  cardStyle: [tw`bg-white-1 p-4`, tw.md`p-6`]
                }}>
                  {views.map(view => <Stack.Screen name={view.name} component={view.component} key={view.name} />)}
                </Stack.Navigator>
              </NavigationContainer>
            </View>
            {skipTutorial
              ? <Footer style={tw`z-10 absolute bottom-0`} active={currentPage} navigation={navigationRef} />
              : null
            }
          </View>
      </MessageContext.Provider>
      </BitcoinContext.Provider>
    </LanguageContext.Provider>
  </SafeAreaView>
}
export default App
