import React, { ReactElement, ReducerAction, useEffect, useReducer, useRef, useState } from 'react'
import { SafeAreaView, View, Animated, LogBox } from 'react-native'
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
import InputTest from './views/inputTest/InputTest'
import { enableScreens } from 'react-native-screens'
import LanguageContext from './components/inputs/LanguageSelect'
import BitcoinContext, { getBitcoinContext, bitcoinContextEffect } from './utils/bitcoin'
import i18n from './utils/i18n'
import PGPTest from './views/pgpTest/PGPTest'
import { Footer, Header, LanguageSelect } from './components'
import Buy from './views/buy/Buy'
import Sell from './views/sell/Sell'
import Offers from './views/offers/Offers'
import Settings from './views/settings/Settings'
import SplashScreen from './views/splashScreen/SplashScreen'
import Welcome from './views/welcome/Welcome'
import NewUser from './views/newUser/NewUser'
import Tutorial from './views/tutorial/Tutorial'
import Message from './components/Message'
import { getMessage, MessageContext, setMessage, showMessageEffect } from './utils/message'
import GetWindowDimensions from './hooks/GetWindowDimensions'
import { account, loadAccount } from './utils/account'
import { initSession, session } from './utils/session'
import RestoreBackup from './views/restoreBackup/RestoreBackup'
import Overlay from './components/Overlay'
import { getOverlay, OverlayContext, setOverlay } from './utils/overlay'
import Search from './views/search/Search'
import Contract from './views/contract/Contract'
import ContractChat from './views/contractChat/ContractChat'
import Refund from './views/refund/Refund'
import { sleep } from './utils/performance'
import TradeComplete from './views/tradeComplete/TradeComplete'
import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils'
import { error, info } from './utils/log'
import { setPeachFee } from './constants'
import { getInfo } from './utils/peachAPI'
import { createWebsocket, getWebSocket, PeachWSContext, setPeachWS } from './utils/peachAPI/websocket'

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])

enableScreens()

const Stack = createStackNavigator<RootStackParamList>()
type ViewType = {
  name: keyof RootStackParamList,
  component: (props: any) => ReactElement
}
const views: ViewType[] = [
  { name: 'splashScreen', component: SplashScreen },
  { name: 'welcome', component: Welcome },
  { name: 'newUser', component: NewUser },
  { name: 'restoreBackup', component: RestoreBackup },
  { name: 'tutorial', component: Tutorial },
  { name: 'home', component: Home },
  { name: 'buy', component: Buy },
  { name: 'sell', component: Sell },
  { name: 'search', component: Search },
  { name: 'contract', component: Contract },
  { name: 'contractChat', component: ContractChat },
  { name: 'tradeComplete', component: TradeComplete },
  { name: 'refund', component: Refund },
  { name: 'offers', component: Offers },
  { name: 'settings', component: Settings },
  { name: 'componentsTest', component: ComponentsTest },
  { name: 'inputTest', component: InputTest },
  { name: 'pgpTest', component: PGPTest },
]

/**
 * @description Method to initialize app by retrieving app session and user account
 * @param navigationRef reference to navigation
 */
const initApp = async (navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>): Promise<void> => {
  const { password } = await initSession()
  if (password) await loadAccount(password)

  const [peachInfo, err] = await getInfo()

  if (peachInfo) {
    setPeachFee(peachInfo.fees.escrow)
  }

  while (!navigationRef.isReady()) {
    // eslint-disable-next-line no-await-in-loop
    await sleep(100)
  }
  setTimeout(() => {
    if (navigationRef.getCurrentRoute()?.name === 'splashScreen') {
      if (account?.settings?.skipTutorial) {
        navigationRef.navigate('home', {})
      } else {
        navigationRef.navigate('welcome')
      }
    }
  }, 3000)
}

/**
 * @description Method to initialize web socket
 * @param updatePeachWS update function
 */
const initWebSocket = async (updatePeachWS: Function): Promise<void> => {
  const ws = createWebsocket()

  updatePeachWS(ws)

  ws.on('message', (message: Message) => {
    info('MESSAGE', message)
  })
  ws.on('close', () => {
    info('CLOSE')
    setTimeout(() => {
      initWebSocket(updatePeachWS)
    }, 3000)
  })
}

// eslint-disable-next-line max-lines-per-function
const App: React.FC = () => {
  const [{ locale }, setLocale] = useReducer(i18n.setLocale, { locale: 'en' })
  const [{ msg, level, time }, updateMessage] = useReducer(setMessage, getMessage())
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket())
  const [{ content, showCloseButton }, updateOverlay] = useReducer(setOverlay, getOverlay())
  const { width } = GetWindowDimensions()
  const slideInAnim = useRef(new Animated.Value(-width)).current
  const navigationRef = useNavigationContainerRef() as NavigationContainerRefWithCurrent<RootStackParamList>

  const bitcoinContext = getBitcoinContext()
  const [, setBitcoinContext] = useState(getBitcoinContext())
  const [currentPage, setCurrentPage] = useState('home')

  ErrorUtils.setGlobalHandler((err: Error) => {
    error(err)
    updateMessage({ msg: i18n((err as Error).message || 'error.general'), level: 'ERROR' })
  })

  setUnhandledPromiseRejectionTracker((id, err) => {
    error(err)
    updateMessage({ msg: i18n((err as Error).message || 'error.general'), level: 'ERROR' })
  })

  useEffect(showMessageEffect(msg, width, slideInAnim), [msg, time])
  useEffect(bitcoinContextEffect(bitcoinContext, setBitcoinContext), [bitcoinContext.currency])

  useEffect(() => {
    (async () => {
      await initApp(navigationRef)
      initWebSocket(updatePeachWS)
    })()
  }, [])

  return <SafeAreaView style={tw`bg-white-1`}>
    <LanguageContext.Provider value={{ locale: i18n.getLocale() }}>
      <PeachWSContext.Provider value={peachWS}>
        <BitcoinContext.Provider value={bitcoinContext}>
          <MessageContext.Provider value={[{ msg, level }, updateMessage]}>
            <OverlayContext.Provider value={[{ content, showCloseButton: true }, updateOverlay]}>
              <View style={tw`h-full flex-col`}>
                {account?.settings?.skipTutorial
                  ? <Header bitcoinContext={bitcoinContext} style={tw`z-10`} />
                  : <View style={[
                    tw`absolute top-10 right-4 z-20`,
                    !session.initialized ? tw`hidden` : {}
                  ]}>
                    <LanguageSelect locale={locale} setLocale={setLocale} />
                  </View>
                }
                {msg
                  ? <Animated.View style={[tw`absolute z-20 w-full`, { left: slideInAnim }]}>
                    <Message msg={msg} level={level} style={{ minHeight: 60 }} />
                  </Animated.View>
                  : null
                }
                {content
                  ? <Overlay content={content} showCloseButton={showCloseButton} />
                  : null
                }
                <View style={tw`h-full flex-shrink`}>
                  <NavigationContainer ref={navigationRef} onStateChange={(state) => {
                    if (state) setCurrentPage(() => state.routes[state.routes.length - 1].name)
                  }}>
                    <Stack.Navigator detachInactiveScreens={true} screenOptions={{
                      detachPreviousScreen: true,
                      headerShown: false,
                      cardStyle: [tw`bg-white-1 px-6`, tw.md`p-8`]
                    }}>
                      {views.map(view => <Stack.Screen name={view.name} component={view.component} key={view.name} />)}
                    </Stack.Navigator>
                  </NavigationContainer>
                </View>
                {account?.settings?.skipTutorial
                  ? <Footer style={tw`z-10 absolute bottom-0`} active={currentPage} navigation={navigationRef} />
                  : null
                }
              </View>
            </OverlayContext.Provider>
          </MessageContext.Provider>
        </BitcoinContext.Provider>
      </PeachWSContext.Provider>
    </LanguageContext.Provider>
  </SafeAreaView>
}
export default App
